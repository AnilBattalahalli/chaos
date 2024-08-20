---
title: "CV"
url: cv
math: true
_build:
  list: never
---

## Education
### University of Michigan – Ann Arbor

**Master's degree - Applied Statistics** \
*(Sep 2020 – Apr 2022)*\
GPA: 3.57/4\
**Relevant Coursework**: Statistical Learning, Statistical Inference, Computational Methods in Statistics and Data Science,
Bayesian Statistics, Design of Experiments, Monte-Carlo Methods

**Graduate Student Research Assistant**\
*D3Center, Institute of Social Research, University of Michigan*
1. Developed SMARTUtils, an R package for analyzing data arising from clustered sequential multiple assignment randomized trials (SMARTs)
2. Worked on the development of simulation-based sample size and effect size calculators for SMARTs
3. Worked on methods to develop more statistically efficient methods for comparing the embedded adaptive
interventions in a clustered SMARTs with longitudinal outcome

### B. M. S. College of Engineering
**Bachelor's degree - Telecommunications Engineering**\
*(2014 - 2018)*\
CGPA: 7.80/10 (Graduated with High Distinction)

**Activities**
1. Organized events like Foxhunt and IR Transmitter hunt for the technical fest at the school.
2. Organized and delivered workshops like ‘Raspberry Pi with Linux and Python’, ‘Introduction to Machine Learning’, etc. with IEEE.
3. As an alumnus, I assisted the Department Advisory Board as a consultant to frame the curriculum for the prospective students.

## Certifications
**Bayesian Statistics (Duke University)**\
Issued Sep 2019\
Credential ID JDRCRY8WQVRH\
[See credential](https://www.coursera.org/account/accomplishments/verify/JDRCRY8WQVRH?trk=public_profile_see-credential)

**Inferential Statistics (Duke University)**\
Issued Sep 2019\
Credential ID R6RL7EQBHFCD\
[See credential](https://www.coursera.org/account/accomplishments/verify/R6RL7EQBHFCD?trk=public_profile_see-credential)

**Linear Regression and Modeling (Duke University)**\
Issued Sep 2019\
Credential ID GU6UMX33HF5F\
[See credential](https://www.coursera.org/account/accomplishments/verify/GU6UMX33HF5F?trk=public_profile_see-credential )

**Introduction to Probability and Data (Duke University)**\
Issued Sep 2019\
Credential ID PW4N3WE65D48\
[See credential](https://www.coursera.org/account/accomplishments/verify/PW4N3WE65D48?trk=public_profile_see-credential)

**Machine Learning (Stanford University)**\
Issued Sep 2019\
Credential ID MPTSTFZQQ9Q8\
[See credential](https://www.coursera.org/account/accomplishments/verify/MPTSTFZQQ9Q8?trk=public_profile_see-credential)

## Skills

Inferential Statistics, Statistical Learning, Monte-Carlo Methods, Design of Experiments, Generalized Estimating Equations, Causal Inference, Computational Methods in Statistics, Bayesian Methods, Linear Algebra, Machine Learning, Artificial Neural Networks, R, Python

## Work Experience
### Westat
*(June 2022 – Present)*\
**Lead Statistical Associate**
- Worked on weighting and statistical disclosure for the population assessment of tobacco and health (PATH) survey
- Analyzed data from the national crime victimization survey (NCVS) using Poisson regression with replicate weights to obtain more
accurate estimates of standard errors by accounting for the complex survey design
-  Built a text-classification model to classify medical documents into drug overdose classes given a medical case and its related
metadata for Drug Abuse Warning Network (DAWN)
- *Assessing Survey Questions through a Machine Learning Pipeline: Emotions and Paralinguistic Behaviors*, Federal Committee on
Statistical Methodology 2023, College Park, MD
- *Using Machine Learning for Image Extraction and Survey Question Evaluation*, American Association for Public Opinion Research
conference 2024, Atlanta, GA

### Westat
*(Jun 2021 – Sep 2021)*\
**Data Science Intern**
- Developed solutions to validate survey data and to detect interviewer falsification using machine learning for speech and text data to reduce the manual review overheads
- Built a pipeline which includes deep audio diarization, speaker change detection, and audio transcription. This was followed by NLP sentence similarity methods to
check for interviewer falsification. I also handled Linux system administration and deployment
- Used character-level LSTM for the classification of survey entities into required classes, which proved to be a lot more effective compared to rule-based methods, which were used previously. This model achieved an accuracy of 94% on testing

### Medilenz Innovations
*(Oct 2019 – Feb 2020)*\
**Machine Learning Consultant**
- Developed deep learning solutions for extracting entities from unstructured medical documents to generate summaries, which helped the company reduce manual bottleneck. This was used in production which reduced the turnover time from 5 days to 10 minutes
- Built a complex functional deep neural network which takes in image information from documents, coordinates from tesseract OCR, and text to detect required entities. The deep neural network comprised of character-level LSTM layers, convolutional layers, and linear input layers
- Used Flask to develop webpages and REST APIs to automate in-house tasks used by medical coding team which reduced some manual overheads by 75%

### Adapt Ready
*(Jul 2018 - Jul 2019)*\
**Machine Learning Engineer**
- Developed Python services and machine learning models for text classification, relationship extraction and web scrapping for Insure-Tech solutions
- Used bag-of-words approach to build a simple text classifier which received web articles from server sent events (SSE). The classifier was highly scalable and modular
with internal message queues (rabbitMQ) and REST endpoints and database interface. The classifier also supported manual review queue for validation and retraining
- Developed novel methods for performing relationship extraction (NLP) using both rule-based methods and sequence models (LSTM) to suit the domain needs
- Assisted the company with technical interviews for machine learning and data science intern positions

### TCS iON
*(Jan 2019 - Feb 2019 )*
**Visiting Professor**
- Worked as a TCS iON visiting professor to conduct the *Introduction to Data Science with Python* nano-course to the students at Sapthagiri College of Engineering


## Projects
### [Bayesian Estimates for Power-Law Distribution using Monte-Carlo Methods](https://anil.battalahalli.me/stats-projects/mcmc_powerlaw/)
- As a part of the final project in the course **Monte-Carlo Methods in Statistics**, I worked on the Bayesian methods for the estimating of the parameters of a power-law
distribution with exponential cut-off by deriving Jeffrey’s prior and Monte-Carlo methods like Metropolis-Hasting and Accept-Reject methods
- I collaborated with a researcher from National Institute for Mental Health and Sciences (NIMHANS) to use the same to model neuronal avalanches to detect lesions and some forms of epilepsy. This proved to be much more efficient compared to the existing methods which use Maximum Likelihood Estimation

### [Bayesian Methods for the Estimation of Infection and Recovery Rates of an Epidemic from Stochastic SIR Data](https://anil.battalahalli.me/stats-projects/bayesian_sir/)
- As a part of the final project in the course **Bayesian Statistics**, I worked on the Bayesian methods for the estimating forecasting COVID cases
- Bayesian methods were applied to the SIR model for epidemics and the infection and recovery rates were estimated using Markov Chain Monte Carlo methods to sample from the posterior

### [Bootstrap Analysis of the Prevalence of Mental Illnesses and Suicide in Different Countries](https://anil.battalahalli.me/stats-projects/analysis_of_mental_illness/)
-  As a part of the final project in the course “Computational Methods in Statistics”, I worked on Bootstrap Analysis of the Prevalence of Mental Illnesses and Suicide in Different Countries
- I used the data from 2021 Human Development Reports of WHO for this research. The method involved EDA, data clean-up, Gower-clustering for dimensionality reduction, and pairwise hypothesis testing for the correlation and means for mental illnesses like Bipolar Disorder, Schizophrenia, Depression, etc

### [Robotic Navigation using Deep-Q Learning](https://github.com/AnilBattalahalli/marker-for-RL?trk=public_profile_project-button)
- Developed a novel approach to robotic navigation which involved a Deep-Q network implemented on a Raspberry Pi controlling the limbs of a four-legged robot. The rewards and punishments were controlled by an external computer interfaced with a camera to detect the location of the robot using computer vision methods
- The robot learnt to walk in a straight path without explicitly programmed to do so in under 10 hours, with the help of rewards and punishments policies

### [Infant Cry Classification with Machine Learning](https://github.com/AnilBattalahalli/infant-cry-ML?trk=public_profile_project-button)
- Worked on the research involving the classification of an infant’s cry into hungry and spasmatic classes to detect abnormalities after the birth
- The method involved the use of Fourier Transform to obtain a sequence of frequency spectra which were then used for classification. The CRNN approach to solving the same yielded an accuracy of 96% on testing samples

### [Machine learning for Epileptic EEG diagnosis](https://github.com/AnilBattalahalli/eeg_spike_detection?trk=public_profile_project-button)
- Developed novel methods for detecting epileptogenic spikes from an EEG for the purpose of diagnosis of epilepsy. The method involved the use of signal processing methods, the nonlinear energy operator and LSTM to classify the spikes into epileptogenic and non-epileptogenic classes
- This research was presented at the ICEECCOT, IEEE Conference – 2018

## Conferences and Publications
- *Standardized Effect Sizes for the Comparison of the Embedded, Clustered Adaptive Interventions in Clustered
SMARTs*; Anandkumar Patel, Anil Battalahalli, Amy Kilbourne, Daniel Almirall. Poster presented at: MSSISS; March 2022; Ann Arbor, MI
- *Assessing Survey Questions through a Machine Learning Pipeline: Emotions and Paralinguistic Behaviors*, Federal Committee on Statistical Methodology 2023, College Park, MD
- *Using Machine Learning for Image Extraction and Survey Question Evaluation*, American Association for Public Opinion Research conference 2024, Atlanta, GA