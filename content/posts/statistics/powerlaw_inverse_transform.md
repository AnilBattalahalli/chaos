---
title: "Generation of Power Law Samples with Inverse Transform Sampling (Python, R and Julia)"
#description: "Can computers summarize the contents of an image?"
dateString: Jan 2020 - Feb 2020
draft: false
tags: ["stats", "sampling"]
showToc: false
weight: 203
math: true
cover:
    image: "stats/powerlaw/powerlaw.jpeg"
--- 

### Implementation of the Inverse Transform Sampling

The probability density function of a power law distribution is given by,

$$f(x\ | \ x_m,\alpha) = \frac{\alpha-1}{x_m} \left(\frac{x}{x_m}\right)^{-\alpha} \ , x>x_m$$

We can find the cumulative density function by,

$$
\begin{aligned}
F(x) &= \int_{-\infty}^x f(x\ | \ x_m,\alpha) \ dx \\\ 
&= \int_{-\infty}^x \frac{\alpha-1}{x_m} \left(\frac{x}{x_m}\right)^{-\alpha} I(x>x_m) \ dx \\\
&= \int_{x_m}^x \frac{\alpha-1}{x_m} \left(\frac{x}{x_m}\right)^{-\alpha} \ dx \\\
&= \frac{\alpha-1}{x_m} \frac{1}{x_m^{-\alpha}} \int_{x_m}^x x^{-\alpha} \ dx \\\
&= \frac{\alpha-1}{x_m^{-\alpha+1}} \left[\frac{x^{-\alpha+1}}{-\alpha+1} \right]_{x_m}^x \\\
F(x) &= 1- \left( \frac{x}{x_m} \right)^{-\alpha+1}\\\
\end{aligned}
$$

For a uniform distribution given by,
$$u \sim \text{Uniform}[0,1]$$

cumulative density is given by,
$$F_u(u) = u$$

To generate power law distributions from uniform distribution,

$$
\begin{aligned}
&F_u(u) = F(x) \\\
u &= 1- \left( \frac{x}{x_m} \right)^{-\alpha+1} \\\
x &= x_m(1-u)^{\frac{1}{1-\alpha}}
\end{aligned}
$$

By fixing the parameters, we can generate x which follows the power law distribution.

I was examining methods to improve Maximum Likelihood Estimation (MLE) for parameters of a power law sample as a part of an independent with two other students.

For the same, we needed methods to generate power law samples with different parameters. There are no implementations in programming languages like MATLAB, Python, R and Julia to generate Power Law distributions. As a part of my graduate course ([STATS 511](https://lsa.umich.edu/stats/phd-students/Statistics-courses.html)), I learnt generation of samples (from a given distribution) from uniform samples.

I implemented the same in Python, R and Julia so that it can be used by anyone who deals with analysis of Power Law distribution.

Find my code on [GitHub](https://github.com/AnilBattalahalli/rPowerLaw).