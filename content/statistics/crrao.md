---
title: "C.R.Rao and his lower bounds"
dateString: Jan 2020 - Feb 2020
draft: false
tags: ["stats", "data analysis"]
showToc: false
weight: 95
math: true
cover:
    image: "stats/crrao/crrao_cover.jpg"
--- 
<p style="text-align: center; font-style: italic; color: #808080;">
  <small>'Abstract Dunes' by Fons Heijnsbroek</small>
</p>


$$
\gdef{\lik}{\mathcal{L}}
\gdef{\X}{\mathbf{X}}
\gdef{\thetavec}{\mathbf{\Theta}}
\gdef{\likfun}{\mathcal{L}(\X|\thetavec)}
\gdef{\score}{s(\thetavec)}
\gdef{\finfo}{\mathcal{I}(\thetavec)}
\gdef{\vartx}{\underset{{X, \thetavec}}{\text{Var}}}
\gdef{\dodotheta}{\frac{\partial}{\partial \thetavec}}
\gdef{\EX}{\underset{\X}{\mathbf{E}}}
$$

Calyampudi Radhakrishna Rao (కల్యంపూడి రాధాకృష్ణారావు) is a legendary mathematician and statistician who has made pioneering contributions to various fields such as information theory, estimation, inference, multivariate analysis, and orthogonal arrays. His groundbreaking work has had a profound impact on not only statistics but also economics, genetics, anthropology, geology, national planning, demography, biometry, and medicine. In April 2023, he received the International Prize in Statistics, also known as the Nobel Prize for Statistics, for his dedication to the field.

I first encountered the Cramér-Rao Lower Bound (CRLB) (which I will derive later in this article) during my second semester at the university. It was not just an inequality that I had to memorize for exams. It was a logical and elegant result that showed the limit of how much information about some parameter can be extracted from a random sample/data in the science of estimation. This is one of the most famous achievements of C.R. Rao that he developed with his professor Harald Cramér. His contributions form the foundation for the field of inferential statistics and are taught at both undergraduate and graduate levels.

Cramér-Rao Lower Bound

Let me try to explain what CRLB is before we get into all the math. Let’s say we are interested in calculating the bias of a coin i.e. what is the probability of getting heads from this coin, we can perform an experiment like tossing a coin a bunch of times.

Bernoulli Trials and the Law of Large Numbers

Let’s say we toss the coin 10 times and we note down the results.

| Trial | Result |
|:-----:|:------:|
|   1   |  Heads |
|   2   |  Heads |
|   3   |  Tails |
|   4   |  Heads |
|   5   |  Tails |
|   6   |  Heads |
|   7   |  Tails |
|   8   |  Heads |
|   9   |  Heads |
|   10  |  Tails |

Results from the coin flip experiment also called the Bernoulli trials

One way to estimate the probability of heads is to simply average over all the trials (empirical probability) where we have heads. Which would give us a probability of 0.6 for heads and 0.4 for tails.

Now as we know, there’s always an error associated with any form of estimation. For instance, if we repeat the experiment again, we may reasonably observe 9 heads and 1 tail and suddenly our point estimate for the probability of heads is 0.9 which is vastly different from what we observed before. So to quantify this error, we construct a confidence interval around it. It is important to notice that the error in estimation is due to the randomness in the observed data; so it seems natural that as we observe more data, we have lower error in estimation. In fact, the Law of Large Numbers applied to this case implies that if we flipped the coin infinite times, we will observe that the empirical probability of heads coincides with the "true" probability of heads for the coin.

We will come back to this motivating example to discuss the lower bound for the error in the estimation of the probability later in the article.

Some basic notations

Now we need to discuss some notations before we proceed. We denote the set of observations as \\(\X = \{x_1, x_2, x_3, \dots, x_n\}\\) and we assume that \\(\{x_1, x_2, x_3, \dots, x_n\}\\) are independent and identically distributed from the distribution \\(f(x ; \mathbf{\Theta})\\) where \\(\mathbf{\Theta}\\) is a vector of parameters that the distribution depends on. For example, in the case of our coin-flip experiment, we have 

<div>
$$
\begin{aligned}
  f(x;p)=\left\{
    \begin{array}{ll}
      p \ &amp;, &amp; x=1\\
      1 - p \ &amp;, &amp; x=0
    \end{array}
  \right.
\end{aligned}
$$
</div>

In this distribution, we have only one parameter $p$ that helps quantify the probability of getting heads with a flip of the coin. We also define likelihood \\(\lik\\) which is the joint density associated with observing \\(\{x_1, x_2, x_3, \dots, x_n\}\\) given by

<div>
$$
\lik(\X| {\mathbf{\Theta}}) = \prod_{i=1}^{n} f(x_i ; \mathbf{\Theta})
$$
</div>

For example, in the case of the coin flip experiment, let's say there are overall $n$ trials out of which \\(m\\) trials are heads, we can represent the likelihood function as,

<div>
$$
\lik(\X| p) = \prod_{i=1}^{n} p^m (1-p)^{n-m}
$$
</div>

In literal terms, given the $p$ for a coin, this function represents the likelihood of observing $m$ heads out of $n$. Now that we have the basic building blocks laid out for this discussion, we can proceed with defining the score.

Score and Fisher Information

The score is defined as the partial derivative of the log-likelihood function with respect to the parameter space. In other words,

<div>
$$
s(\thetavec|\X) = \frac{\partial }{\partial \thetavec}{\log \likfun}
$$
</div>

When we think of \\(\thetavec\\) in 1-D, we can easily interpret the score function as the quantification of the sensitivity of the log-likelihood function with infinitesimal changes in the parameter \\(\theta\\). In fact, maximum likelihood estimation can be performed by simply setting \\(\score = 0\\) and solving for \\(\thetavec\\). 

Given this, we can make a simple observation that if the data carries a lot of information about the parameter \\(\thetavec\\), then \\(\score\\) would be very sensitive to the choice of \\(\thetavec\\). In other words, we can say that the data carries a lot of information about \\(\thetavec\\) if the variance of \\(\score\\) is high.

This is basically the whole point of Fisher information which was formulated by R.A Fisher given by \\(\mathcal{I}(\theta)\\) where,

<div>
$$
\begin{aligned}
\finfo = \underset{{\X, \thetavec}}{\text{Var}} \  \score
\end{aligned}
$$
</div>

Deriving the formula for Fisher information

Even though we have an expression above that relates the variance of the score and Fisher information, we will now derive another relation for Fisher information with the expectation of the score that's used more widely. 

From the definition, we have

<div>
$$
\begin{aligned}
\finfo &amp;= \underset{{\X, \thetavec}}{\text{Var}} \  \score\\
&amp;= \underset{{\X}}{\text{Var}} \ \left( \dodotheta {\log \likfun} | \thetavec \right) \\
\end{aligned}
$$
</div>

But, from the moments' property, we have

<div>
$$
\text{Var}(\mathbf{Y}|\thetavec) = \mathbf{E}(\mathbf{Y}^2|\thetavec)+\mathbf{E}(\mathbf{Y}|\thetavec)^2
$$
</div>

Therefore, the Fisher information now becomes, 

<div>
$$
\finfo = \underset{{\X, \thetavec}}{\text{Var}} \  \score = \\
\EX\left( \left(\dodotheta \log \likfun\right)^2 | \  \thetavec \right)+ \left(\EX\left( \dodotheta \log \likfun \  | \  \thetavec \right)\right)^2
$$
</div>

Let's focus on the second term there, \\(\left(\EX\left( \dodotheta \log \likfun \ | \ \thetavec \right)\right)^2\\)

\\(\EX\left( \dodotheta \log \likfun \ | \ \thetavec \right)\\) is very easy to work with


<div>
$$
\EX \left(\dodotheta \log \likfun | \thetavec \right) = \int_{\chi} \dodotheta \log \likfun \ \  f(\X|\thetavec) dx 
$$
</div>

But we know that,

<div>
$$
\frac{d}{dx} (\log x) = \frac{1}{x}
$$
</div>

So now for a single data point $x$ and \\(\likfun = f(x|\thetavec)\\) we have, 

<div>
$$
\begin{aligned}
\EX \left(\dodotheta \log  f(x|\thetavec) | \thetavec \right) &amp;= \int_{\chi} \dodotheta \log  f(x|\thetavec) \ \  f(x|\thetavec) \ dx \\
&amp;= \int_{\chi} \dodotheta f(x|\thetavec) \frac{f(x|\thetavec)}{f(x|\thetavec)} \ dx \\ 
&amp;= \int_{\chi} \dodotheta f(x|\thetavec) dx\\
&amp;= \dodotheta \int_{\chi} f(x|\thetavec) dx\\
&amp;= 0
\end{aligned}
$$
</div>

This gives us one of the solutions for Fisher information:

<div>
$$
\finfo =
\EX\left( \left(\dodotheta \log \likfun\right)^2 | \  \thetavec \right)
$$
</div>

Now consider \\(\frac{\partial ^2} {\partial \thetavec^2} \log \likfun\\),

<div>
$$
\begin{aligned}
\frac{\partial ^2} {\partial \thetavec^2} \log \likfun = \frac{\frac{\partial ^2} {\partial \thetavec^2}{\likfun}}{\likfun} - \left(\frac{\frac{\partial} {\partial \thetavec}{\likfun}}{\likfun} \right)^2
\end{aligned}
$$
</div>

Taking expectations throughout the equation, we have

<div>
$$
\begin{aligned}
\mathbf{E}\left[\frac{\partial ^2} {\partial \thetavec^2} \log \likfun\right] &amp;= \mathbf{E}\left[\frac{\frac{\partial ^2} {\partial \thetavec^2}{\likfun}}{\likfun}\right] - \mathbf{E}\left[\left(\frac{\frac{\partial} {\partial \thetavec}{\likfun}}{\likfun} \right)^2\right] \\ 
\mathbf{E}\left[\frac{\partial ^2} {\partial \thetavec^2} \log \likfun\right] &amp;= \mathbf{E}\left[\frac{\frac{\partial ^2} {\partial \thetavec^2}{\likfun}}{\likfun}\right]- \mathbf{E}\left[\left( \dodotheta \log \likfun \right)^2\right]
\end{aligned}
$$
</div>

We can use the same trick to show that \\(\mathbf{E}\left[\frac{\frac{\partial ^2} {\partial \thetavec^2}{\likfun}}{\likfun}\right] = 0\\) and plugging that into the expression we have,

<div>
$$
\mathbf{E}\left[\frac{\partial ^2} {\partial \thetavec^2} \log \likfun\right] = \mathbf{E}\left[\frac{\frac{\partial ^2} {\partial \thetavec^2}{\likfun}}{\likfun}\right]- \mathbf{E}\left[\left( \dodotheta \log \likfun \right)^2\right]
$$
</div>

Rearranging the terms, 

<div>
$$
\mathbf{E}\left[\frac{\partial ^2} {\partial \thetavec^2} \log \likfun\right] = - \mathbf{E}\left[\left( \dodotheta \log \likfun \right)^2\right]
$$
</div>

or, 

<div>
$$ \finfo = -
\mathbf{E}\left[\frac{\partial ^2} {\partial \thetavec^2} \log \likfun\right]
$$
</div>

Going back to our motivating example of Bernoulli trials as it turns out, the Fisher information for $n$ trials is given by, 

<div>
$$
\begin{aligned}
	\mathcal{I}_X(p) = 
	\frac{n}{p(1 - p)}\\
\end{aligned}
$$
</div>

Let's observe this for a bit. We have a constant $n$ which we can ignore for now. The denominator is \\(p (1-p)\\) which maximizes at \\(p = \frac{1}{2}\\) or, the Fisher information is at its minimum at \\(p = \frac{1}{2}\\). Why is this?

Conceptually, this means that when \\(p = \frac{1}{2}\\), the Bernoulli trial is equally likely to produce a “success” or a “failure”. This makes it difficult to estimate the value of p from a sample of observations because there is no clear pattern in the data that would allow you to distinguish between different values of p which implies that the Fisher information is low for an unbiased coin for a given number of trials.

Now we have all the pieces we need to derive the Cramér-Rao Lower Bound

Let's start with an estimator \\(\hat{\thetavec}(\X)\\) and let's assume that it is unbiased. Mathematically, 

<div>
$$
\mathbf{E}\left[\hat{\thetavec}(\X) - \thetavec \right] = 0
$$
</div>

We can see that the randomness here pertains to \\(\X\\), so we have

<div>
$$
\begin{aligned}
\int_{\chi} \left(\hat{\thetavec}(\X) - \thetavec\right) f(x; \thetavec) dx = 0\\
\end{aligned}
$$
</div>

Taking partial derivatives \\(\dodotheta\\) on both sides and applying the product rule for integration,

<div>
$$
\begin{aligned}
\dodotheta \int_{\chi} \left(\hat{\thetavec}(\X) - \thetavec\right) f(x; \thetavec) dx &amp;= 0\\
\int_{\chi} \dodotheta f(x|\thetavec) \left(\hat{\thetavec}(\X) - \thetavec\right) dx &amp;= \int_{\chi} f(x; \thetavec) dx\\
\int_{\chi} \dodotheta f(x|\thetavec) \left(\hat{\thetavec}(\X) - \thetavec\right) dx &amp;= 1
\end{aligned}
$$
</div>

Multiply and divide the integrand by \\(f(x; \thetavec)\\)

<div>
$$
\begin{aligned}
\int_{\chi} \dodotheta f(x|\thetavec) \frac{f(x|\thetavec)}{f(x|\thetavec)} \left(\hat{\thetavec}(\X) - \thetavec\right) dx &amp;= 1\\
\end{aligned}
$$
</div>

Using the log derivative trick we can rewrite the equation above as,

<div>
$$
\begin{aligned}
\int_{\chi} \dodotheta \log f(x|\thetavec) \  f(x|\thetavec) \left(\hat{\thetavec} \ (\X) - \thetavec\right) dx &amp;= 1\\
\end{aligned}
$$
</div>

Let us factor \\(f(x|\thetavec)\\) as \\(\sqrt{f(x|\thetavec)} \ \times \ \sqrt{f(x|\thetavec)}\\)

<div>
$$
\begin{aligned}
\int_{\chi} \left(\dodotheta \log f(x|\thetavec) \  \sqrt{f(x|\thetavec)}\right) \ \left(\sqrt{f(x|\thetavec)} \left(\hat{\thetavec} \ (\X) - \thetavec\right)\right) dx &amp;= 1\\
\end{aligned}
$$
</div>

Now we use Cauchy-Schwartz inequality, i.e.

<div>
$$
\left(\int_{A} f(x) \ g(x)\right)^2 \le \int_{A}f^2(x) dx \int_{A} g^2(x) dx
$$
</div>

Applying this to the integral at hand,

<div>
$$
\begin{aligned}
\left[ \int_{\chi} \left(\dodotheta \log f(x|\thetavec) \  \sqrt{f(x|\thetavec)}\right) \ \left(\sqrt{f(x|\thetavec)} \left(\hat{\thetavec} \ (\X) - \thetavec\right)\right) \ dx \right]^2 \\ 
\le \int_{\chi} \left[\dodotheta \log f(x|\thetavec)\right]^2 \  f(x|\thetavec) \ \ dx \ \times \ \int_{\chi} \left(\hat{\thetavec} \ (\X) - \thetavec\right)^2 \ f(x|\thetavec) \ dx
\end{aligned}
$$
</div>

Here, we already know that,

<div>
$$
\begin{aligned}
\finfo &amp;= \mathbf{E} \left({\dodotheta \log f(x; \thetavec)}\right)^2 = \int_{\chi} \left[\dodotheta \log f(x|\thetavec)\right]^2 \ f(x|\thetavec) \ \ dx \\
\text{Var} \ \thetavec &amp;=  \int_{\chi} \left(\hat{\thetavec} \ (\X) - \thetavec\right)^2 \ f(x|\thetavec) \ dx \\
\end{aligned}
$$
</div>


Also from the previous result, 

<div>
$$
\int_{\chi} \left(\dodotheta \log f(x|\thetavec) \  \sqrt{f(x|\thetavec)}\right) \ \left(\sqrt{f(x|\thetavec)} \left(\hat{\thetavec} \ (\X) - \thetavec\right)\right) dx = 1\\
$$
</div>

Putting things together, we have:

<div>
$$
\finfo \ \text{Var} \ \thetavec \ge 1
$$
</div>

or,

<div>
$$
\text{Var} \ \thetavec \ge \frac{1}{\finfo}
$$
</div>

And this beautiful equation provides us with a lower bound for the error of an estimator. You can see that it is not a strict inequality. When the variance of an estimator reaches the Cramér-Rao Lower Bound is called the most efficient estimator. When your unbiased estimator reaches CRLB, you can stop searching for a better estimator.
