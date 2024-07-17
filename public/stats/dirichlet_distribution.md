---
title: "Is the Dirichlet Function Riemann-Darboux Integrable?"
#description: "Can computers summarize the contents of an image?"
dateString: Jan 2021 - Feb 2021
draft: false
tags: ["stats", "data analysis"]
showToc: false
weight: 180
math: true
cover:
    image: "stats/dirichlet_distribution/dirichlet.jpg"
--- 
<p style="text-align: center; font-style: italic; color: #808080;">
  <small>This is not really stats project but it is pretty cool</small>
</p>

$$
\gdef{\boldphi}{\boldsymbol{\phi}}
$$

## The Dirichlet Function

The Dirichlet function is one of the easiest functions to define. It's literally,

<div>
$$
\begin{aligned}
  f(x)&=\left\{
    \begin{array}{ll}
      1, & \text{if } x \text{ is rational} \\
      0, & \text{if } x \text{ is not rational}
    \end{array}
  \right.
\end{aligned}
$$
</div>

or using the symbols from number theory/set theory that almost no one remembers,

<div>
$$
\begin{aligned}
  f(x)=\left\{
    \begin{array}{ll}
      1, &amp; \text{if $x \in \mathbb{R -Q}$}\\
      0, &amp; \text{if $x \in \mathbb{Q}$}
    \end{array}
  \right.
\end{aligned}
$$
</div>

While this seems simple to define, things get more and more complex as you try to explore the behavior of the function. For one, this is a highly discontinuous function with range \\( [0, 1] \\) and domain \\( \mathbb{R} \\). This is a very strange bounded non-monotonic function that is "nowhere continuous", and not just infinitely discontinuous.

Let's learn the definitions of rational numbers, irrational numbers, and integrability, before we try to see if this function can be integrated.

## Rational and Irrational Numbers

### Definitions

A rational number is any number that can be expressed as a ratio of two integers. 

Mathematically,

<div>
$$
\begin{aligned}
&amp;p/q, &amp; p, q \in \mathbb{Z}, q \ne 0
\end{aligned}
$$
</div>

An irrational number is any real number that isn't a rational number. In other words, irrational numbers can not be expressed as a ratio of two integers. The examples include \\( \pi \\), \\( e \\), \\( \sqrt{2} \\), etc.

### History

The studies pertaining to rational and irrational numbers date back to Ancient Greece where one of the Philosophers tried to solve for the hypotenuse of the right angle triangle from the Pythagoras theorem, only to end up with some messy numbers with contradictions (in this era, the irrational numbers were called 'immeasurable quantities"). In 800 BC, ancient Indians said, "This is unsolvable! we are going to use numerical methods to find the approximate values for the square roots of unpleasant numbers", and did so in the book Sulabha Sutra. Aryabhata after many years solved the value of pi to a few decimals, in the decimal system. After this, mathematicians in the middle east called measurable quantities and immeasurable quantities 'real numbers' owing to the development of Algebra by notable mathematicians like Al-Khawarizmi. Of course, by the 17th century, we knew enough mathematics from number theory, real analysis, logarithms, which made it easier to analyze irrational numbers.

### A very weird property of the density of Rational and Irrational numbers

According to the "density" property of the rational and irrational numbers, in an interval, \\( (a, b) \\), where \\( a < b \\), there exists a \\( c \in (a,b) \\) such that, \\( c \in \mathbb{Q} \\) and a \\( d \in (a,b) \\) such that, \\( d \in \mathbb{R - Q} \\).

No matter how small the interval is ('a' in mathematics often means 'at least a' or 'one or more than one'). Imagine that!. Between 3 and 5, there's a rational number and an irrational number. Between 0.1 and 0.2, there's a rational number and an irrational number. Between 0.000000001 and 0.000000002, there's a rational number and an irrational number. You get the point. Keep this point in mind. We will be using it later on.

## Integrability

The integral that we've studied in calculus in school is called the Riemann integral. If the integral of a function is an operation that calculates the area as the function of the support, we'd definitely want the function to be infinite in that interval, as the sum of infinity with any other finite number is infinity which is not defined. We would definitely not want the function to jump around so much that no finite interval can be found on the x-axis to find its area. With the Dirichlet function, we seem to have that problem. But let's mathematically try to see if it is so.

According to the Riemann-Darboux integrability criterion, you can find the integral of a bounded function in an interval \\( [a, b] \\) only if it satisfies the following.

If a partition of \\( [a, b] \\) is a finite sequence, such that \\( a < x_1 < x_2 < \dots < x_{n-1} <b \\), consider the boundary points set 
\\( P = \lBrace x_1, x_2, \dots , x_{n-1} \rBrace \\)

Now define,

<div>
$$
\begin{aligned}
M_i = \displaystyle{\sup_{x \in [x_{i-1}, x_i]}}f(x) \\ \\
m_i = \displaystyle{\inf_{x \in [x_{i-1}, x_i]}}f(x)
\end{aligned}
$$
</div>

If this confuses you, just know that $M_i$ is a function that finds the maximum value of \\( f(x) \\) in the interval \\( [x_{i-1}, x_i] \\), and \\( m_i \\) finds the minimum value of \\( f(x) \\) in the interval \\( [x_{i-1}, x_i] \\).

Now if \\( a = x_0 \\) and \\( b = x_n \\), then the Upper Darboux Sum is given by,

\\( U_{f,P} = \sum_{i=1}^n(x_i-x_{i-1}) \ M_i \\)
and the Lower Darboux Sum is given by,
\\( L_{f,P} = \sum_{i=1}^n(x_i-x_{i-1}) \ m_i \\)

Then the integral of \\( f(x) \\) in the interval \\( [a, b] \\) is given by,

<div>
$$ \begin{aligned} \int_a^b f(x) \ dx &= \inf\{{U_{f,P}:P \ \text{is any partition of }[a, b]\}} \\ &= \sup{\{L_{f,P}:P \ \text{is any partition of }[a, b]\}} \end{aligned} $$
</div>

In other words, we need \\( \inf{U_{f,P}} = \sup{L_{f,P}} \\) to be true for the function to be integrable.

## Stitching the pieces together
### Integrability of the Dirichlet function

For a partition of \\( [a, b] \\), and the boundary points set \\( P = \{x_1, x_2, \dots, x_{n-1} \} \\), let's define -

<div>
$$
\begin{aligned}
&amp;M_i &amp;= \displaystyle{\sup_{x \in [x_{i-1}, x_i]}}f(x) \\ \\
&amp;m_i &amp;= \displaystyle{\inf_{x \in [x_{i-1}, x_i]}}f(x)
\end{aligned}
$$
</div>

where, just to recap, the function at hand is,

<div>
$$
\begin{aligned}
  f(x)=\left\{
    \begin{array}{ll}
      1, &amp; \text{if $x \in \mathbb{R -Q}$}\\
      0, &amp; \text{if $x \in \mathbb{Q}$}
    \end{array}
  \right.
\end{aligned}
$$
</div>

From the "density property", we know that in every interval \\( [x_{i-1}, x_i] \\), there's a rational number and there's an irrational number. And furthermore, for a rational number, \\( f(x) = 1 \\) and for an irrational number \\( f(x)=0 \\). And also, we know that \\( 0<1 \\) (lol).

Therefore, \\( M_i = \displaystyle{\sup_{x \in [x_{i-1}, x_i]}}f(x) = 1 \\) in every interval of \\( P \\).

Similarly, \\( m_i = \displaystyle{\inf_{x \in [x_{i-1}, x_i]}}f(x) = 0 \\) in every interval of \\( P \\).

Hence, the lower and upper Darboux sums become,

<div>
$$
\begin{aligned}
&amp;U_{f,P} = \sum_{i=1}^n(x_i-x_{i-1}) \ M_i = \sum_{i=1}^n(x_i-x_{i-1}) \ (1) = (x_n-x_0) \ (1) = b-a \\
&amp;L_{f,P} = \sum_{i=1}^n(x_i-x_{i-1}) \ m_i = \sum_{i=1}^n(x_i-x_{i-1}) \ (0) = 0
\end{aligned}
$$
</div>

This is true irrespective of the choice of the partition \\( P \\).

This means that, \\( \inf{U_{f,P}} = U_{f,P} = b-a \\) and \\( \sup{L_{f,P}} = L_{f,P} = 0 \\)
This means that, \\( \inf{U_{f,P}} \ne \sup{L_{f,P}} \\), **which means that the Dirichlet function is not integrable**.

