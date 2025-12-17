
---
title: 'Nondeterminism in LLM Inference: From Floating-Point Arithmetic to Engineering Implementation'
description: 'Why LLM inference produces different outputs with temperature=0: exploring how batch-variant operators in inference engines introduce nondeterminism through floating-point arithmetic, and how batch-invariant implementations achieve bitwise reproducibility for reinforcement learning.'
pubDate: 'Dec 17 2025'
updatedDate: 'Dec 17 2025'  # Optional
---


## The Problem

Why do large language models produce different outputs for identical inputs even when `temperature=0`? This counterintuitive phenomenon reveals the engineering trade-offs modern inference engines make in pursuit of extreme performance.

## The Root Cause

### Non-Associativity of Floating-Point Operations

Floating-point arithmetic in computers does not satisfy the associative property. While mathematically `(a + b) + c = a + (b + c)` always holds, this equality may fail with finite-precision floating-point operations due to rounding errors.

**Concrete Example**:
```
Numbers: x=10000000, y=1, z=-10000000

Order 1: (x + y) + z
       = 10000001 + z     // Precision loss, becomes 10000000
       = 0

Order 2: x + (y + z)  
       = x + (-9999999)
       = 1
```

### Parallel Computation Alters Operation Order

To maximize efficiency, GPU parallel computation splits sequential calculations into multiple parallel paths and then merges results. Different parallelization strategies mean different addition tree structures, leading to different floating-point rounding paths.

**Serial Computation**:
```python
sum = 0
for i in data:
    sum += i  # Fixed order
```

**Parallel Computation (2 threads)**:
```
Thread 1: (((a+b)+c)+d)
Thread 2: (((e+f)+g)+h)
Final: thread1 + thread2
```

**Parallel Computation (4 threads)**:
```
t1: a+b,  t2: c+d,  t3: e+f,  t4: g+h
Then: (t1+t2) + (t3+t4)
```

While mathematically equivalent, the topology of the addition tree is completely different, resulting in different floating-point accumulation errors.

## The Batch-Variant Problem

### Dynamic Optimization in Inference Engines

Modern inference engines (e.g., vLLM, TensorRT) dynamically select parallelization strategies based on current load to achieve maximum GPU utilization:

| Batch Size | Parallelization Strategy |
|-----------|-------------------------|
| Small batches | Simple kernels |
| Large batches | Complex parallel kernels |
| Mixed workloads | Dynamic kernel switching |

This means **the same input takes different computational paths under different loads**.

### Batch-Variant Characteristics of Key Operators

Three operators most prone to nondeterminism:

1. **RMSNorm**: Requires reduction across hidden dimensions; reduction tree structure varies with batch size
2. **MatMul**: Large-scale matrix multiplication accumulation order is highly sensitive
3. **Attention**: The exp-sum-normalize chain in softmax is a hotspot for numerical instability

## argmax: The Amplifier of Tiny Errors

### What is argmax

argmax returns not the maximum value itself, but **the position of the maximum value**.

```python
logits = [5.000000, 4.999999, 3.2]
argmax(logits) = 0  # Returns token at index 0

# But if parallel path changes cause tiny errors
logits = [4.999998, 4.999999, 3.2]  
argmax(logits) = 1  # Returns token at index 1
```

### Why So Fragile

argmax is a **cliff-edge mapping from continuous to discrete**:

- Before argmax: numerical changes are smooth
- After argmax: results are binary (black or white)

Therefore, a 0.000001 numerical error can lead to:
- 100% different token selection
- Completely different subsequent generation paths
- Total divergence of generated text

This is why `temperature=0` is actually the most unstable—it relies entirely on the fragile "blade" of argmax.

## The Solution: Batch-Invariant Operators

### Core Idea

Not eliminating parallelism, but **keeping the reduction structure consistent across any batch size**.

### Implementation Approach

1. **Fixed reduction tree**: Use the same addition tree regardless of batch size
2. **Disable automatic kernel switching**: Explicitly specify computation paths; prevent engine from dynamically selecting based on load
3. **Unified normalization order**: Force fixed computation order in attention and softmax

### Trade-offs

- ✅ Achieves complete determinism (bitwise identical results)
- ❌ Sacrifices some GPU throughput and dynamic optimization capability

### Experimental Validation

On Qwen3-235B model:
- **Before fix**: Same prompt produces 80 different outputs across 1000 inferences
- **After fix**: 1000 inferences produce identical output

## Critical Impact on Reinforcement Learning

### On-Policy vs Off-Policy

In reinforcement learning, on-policy requires:
```
Sampling policy π_sample = Training assumed policy π_train
```

But due to inference nondeterminism:
- You think you're doing greedy sampling (`temperature=0`)
- Actually argmax boundaries keep flipping
- Resulting in `π_sample ≠ π_train`
- Becomes **pseudo off-policy**

### KL Divergence Verification

After adopting batch-invariant operators, KL divergence during training remains at 0, proving complete consistency between sampling and training. This is nearly impossible in traditional LLM reinforcement learning.

## Engineering Status and Outlook

### Current State

- ✅ Working research prototype available ([GitHub repository](https://github.com/thinking-machines-lab/batch_invariant_ops))
- ✅ Validated on 235B-scale models
- ❌ Not yet integrated into mainstream inference engines (vLLM, TensorRT)

### Why Not Yet Adopted

1. **Performance cost**: Fixed computation paths mean abandoning dynamic optimization
2. **Priority mismatch**: Most applications use `temperature>0`, which already allows randomness
3. **Design philosophy conflict**: Mainstream engines prioritize throughput over determinism

### Understanding the Scope of the Solution

This approach is easily misunderstood as a "permanent reproducibility" solution, but it actually addresses **local temporal consistency**.

**What it does NOT guarantee**:
- Cross-version reproducibility (model weights, tokenizers will update)
- Cross-time reproducibility (inference engines, CUDA versions will change)
- Historical archival replay (doesn't record kernel versions, reduction trees)

**What it truly guarantees**:
- Within the same model version, same inference system, same deployment cycle
- Inference results do not drift due to load and scheduling variations
- This is about "eliminating system noise," not "freezing history"

By analogy, this is more like **database transaction isolation levels** rather than permanent snapshots—it guarantees consistent behavior within a transaction, but not replay of the same transaction ten years later.

Why not record the complete computation path? Because recording every kernel, every block/warp, every floating-point rounding point on a 235B model is infeasible in terms of storage, replay, and performance. The approach chosen is **structural constraints to guarantee path equivalence**—the only engineering-viable route.

### True Application Scenarios

The core value of this solution lies in **consistency within the same time window**:

1. **Reinforcement Learning Training**: In a single training round, if the sampling policy drifts due to batch changes, that round is already contaminated. This isn't about whether we can reproduce results three months later—it's about maintaining on-policy within the current training cycle.

2. **Scientific Research**: Requires bitwise-level reproducibility during the experiment period to eliminate system noise from interfering with experimental conclusions.

3. **Security Auditing**: Within the audit period, identical inputs must produce identical outputs to support behavior tracing.

### Future Form

More likely to appear as an **optional mode** in inference engines:
```bash
vllm serve --deterministic
vllm serve --batch-invariant
vllm serve --rl-training-mode
```

Similar to PyTorch's `torch.use_deterministic_algorithms(True)`, allowing users to choose between performance and determinism.

## Temperature and Randomness

### The Role of Temperature

Temperature doesn't directly control "whether it's random" but rather **adjusts the steepness of the probability distribution**:

```
p_i = exp(z_i / T) / Σ exp(z_j / T)
```

| Temperature | Probability Distribution | Behavioral Characteristics |
|------------|-------------------------|---------------------------|
| 0 | [1, 0, 0] | Completely deterministic (argmax) |
| 1 | [0.5, 0.3, 0.2] | Original model distribution |
| 2 | [0.41, 0.32, 0.27] | More smooth |
| 5 | [0.36, 0.33, 0.31] | Near-uniform distribution |

### Key Distinction

- **Temperature**: Changes probability distribution
- **Sampling**: Rolls the dice according to probability distribution

`temperature>0` doesn't mean "will be random"—only when combined with sampling does it truly introduce randomness.

## Summary

The nondeterminism problem in LLM inference reveals a profound engineering truth:

> **A single forward pass is deterministic, but inference engines use different numerical computation paths under different loads for performance reasons.**

The solution isn't eliminating parallelism but **freezing the parallel structure** to keep the numerical path consistent in all cases. This is a clear engineering trade-off—exchanging some performance for complete determinism.

This solution is currently best suited for scenarios with extreme determinism requirements, particularly reinforcement learning training. It represents a new engineering perspective: sometimes, "slow but stable" is more valuable than "fast but erratic."

---

**References**:
- Article: [Defeating Nondeterminism in LLM Inference](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/)
- Code: [batch_invariant_ops](https://github.com/thinking-machines-lab/batch_invariant_ops)
