# FHIR Questionnaire Prototype

## Summary

The FHIR Questionnaire Prototype was developed as part of a proof of concept for utilizing the HL7 FHIR Questionnaire Resource to collect data related to Health Equity Initiatives. As part of this prototype, two social determinants of health (SDOH) assessment question sets and a set of expanded demographic data elements were formatted as  FHIR Questionnaires. Specifically, this included:
- Accountable Healthcare Communities (AHC) Health-Related Social Needs Screening Tool
- North Carolina’s Department of Health & Human Services (DHHS) standardized SDOH Screening Questions 

In order to capture standardized demographic data, the US Core Data for Interoperability (USCDI) v2 Expanded Demographic data elements were inserted before each question set.

We are posting the prototype code developed for this proof of concept in case it may be useful to Health IT developers.  Use of the HL7 FHIR Questionnaire for collection of these data are not required as of fall 2022.

## What is FHIR?

Health Level 7 (HL7) Fast Healthcare Interoperability Resources (FHIR®) is an interoperability standard for exchanging electronic health information. FHIR allows data to be exchanged between different systems that otherwise cannot communicate. This allows data to be shared in an automated way that ensure it is actionable and can be used to address healthcare needs across the continuum of care, supporting patients, providers, payers, and those who support them.  

## Prototype Details

### Questionnaire Definitions
Two Questionnaires were selected for this prototype - two of them are social determinants of health assessment question sets.  In order to capture standardized demographic data, the USCDI v2 expanded demographic data elements were inserted within the questionnaires before each question set. These Questionnaires leverage the resource found [here](https://www.hl7.org/fhir/questionnaire.html).

The Questionnaires, where possible, use [LOINC](https://loinc.org/) codes to identify individual items to support standardized mapping from other systems.
Each makes use of the FHIR translation [extension](https://www.hl7.org/fhir/extension-translation.html) - currently each Questionnaire includes a Spanish translation for questions and answer selections.

These Questionnaires include hardcoded ValueSets for the answer option values (e.g.) the North Carolina Questionnaire has a ValueSet for "yes/no" answers that is reused across all questions in that Questionnaire. 

The answers to a Questionnaire are represented by the QuestionnaireResponse object.
NOTE: While some of the ValueSets leveraged for this prototype use an established CodeSystem, not all of them do. As such, these are not considered final, standard Questionnaires. These are simply a demonstration of how the HL7 FHIR Questionnaire Resource could be used to capture data related to Health Equity Initiatives.

## Assessment Details

The answers to each Questionnaire are represented by the HL7 FHIR QuestionnaireResponse resource.

## Assessment Details

### AHC Health-Related Social Needs Screening Tool

As mentioned in the [CMS Innovation Center 2021 Strategy Refresh](https://innovation.cms.gov/strategic-direction-whitepaper), the Accountable Health Communities (AHC) Model examined whether identifying and addressing the health-related social needs of Medicare and Medicaid beneficiaries would improve health outcomes and reduces costs. To assess this, the CMS Innovation Center created a [Health-Related Social Needs Screening Tool](https://innovation.cms.gov/files/worksheets/ahcm-screeningtool.pdf) for use in the AHC Model.

### North Carolina SDOH Screening Questions

Medical practices and providers in North Carolina were also interested in addressing social determinants of health (SDOH). To address this need, North Carolina’s Department of Health & Human Services (DHHS), in partnership with other stakeholders, developed this [standardized set of SDOH screening questions](https://www.ncdhhs.gov/about/department-initiatives/healthy-opportunities/screening-questions).

### USCDI v2 Expanded Demographic Data

The Office of the National Coordinator for Health Information Technology (ONC) developed the US Core Data for Interoperability (USCDI), a standardized set of health data classes and constituent data elements, to support interoperable data exchange.  An overview of USCDI v2 Patient Expanded Demographic data can be found [here](https://www.healthit.gov/isa/uscdi-data-class/patient-demographics#uscdi-v2).


## How to use the Questionnaire Resources
While use of these Questionnaires is not required, providers may begin using them if they desire. 

## How to use the Questionnaire Resource

These Questionnaires provide one example for how data related to Health Equity Initiatives  could be captured leveraging HL7 FHIR. 

## LForms

For this prototype, the Questionnaires were rendered using the LForms library (source code [here](https://github.com/lhncbc/lforms)). LForms is an open-source form rendering library that supports transforming Questionnaires to its native form structure. Note that it does not render the Questionnaire itself, but a transformed version of it. This makes it difficult to add FHIR specific extensions, as any extension needs to be converted to the underlying LForms format first.

LForms supports rendering Questionnaires and supports transforming the form output into a QuestionnaireResponse.


For any questions about the FHIR Questionnaire or Bulk FHIR Export POCs, please send email to: CMMI_HE_info@cms.hhs.gov.
