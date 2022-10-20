### Bulk FHIR Sandbox Experimental Prototype

### What is FHIR?
Health Level 7 (HL7) Fast Healthcare Interoperability Resources (FHIR®) is an interoperability standard for exchanging electronic health information. FHIR allows data to be shared in a way that ensures it is actionable and can be used to address healthcare needs across the continuum of care, supporting patients, providers, payers, and those who support them.  

### What is Bulk FHIR?

As of December 31, 2022, the Office of the National Coordinator for Health Information Technology (ONC) will require Electronic Health Record systems (EHRs) considered Certified Health IT to support group-level export consistent with the FHIR Bulk Data Access Implementation Guide (IG). See:  https://www.healthit.gov/test-method/standardized-api-patient-and-population-services.

Since EHRs will be required to support this from January 2023 forward, the HL7 FHIR Bulk Data Export is one method that the Centers for Medicare & Medicaid Services (CMS) Innovation Center is evaluating for possible future consideration to support model data submissions in a more automated and less burdensome manner.

### What is the Bulk FHIR Sandbox Experimental Prototype?

This Bulk FHIR Sandbox Experiment Prototype is a tool used to simulate the use of the Bulk Data Export as one way to test the possible feasibility of this method of FHIR data submission.

We note that this is only a concept being evaluated for possible consideration as of the fall of 2022. Use of the HL7 Bulk Data Export is not required for Innovation Center Model participation at this time.

This repository can be used to test out Bulk FHIR Exports from your own FHIR-based system. You can bring this tool up locally, enter your system's info in the Bulk FHIR Sandbox UI, trigger a bulk export, and view/download the results of the bulk export.

The Bulk FHIR prototype code is in Docker containers; support and direction are not provided by CMS for working with Docker containers. This repository contains several containers, including:

- the Bulk FHIR Sandbox, which is a Node app
- a Bulk Test Server (an instance of https://bulk-data.smarthealthit.org/), used to locally generate synthetic data for a Bulk FHIR Export in the absence of an external FHIR server to test with
- a local FHIR Service (an instance of https://github.com/microsoft/fhir-server) to receive the exported data

Running a bulk export using this tool in a local development environment does not transmit any data to CMS servers (or any external servers).

Note:  The Bulk FHIR code is provided as is; no guarantee is made regarding testing and functionality.  For example, libraries may need to be updated if they are out-of-date.

### Installing and Configuring the Bulk FHIR Sandbox Experimental Prototype Locally
### Prerequisites:

- docker
- docker-compose
- node

### First-time setup

```
. ./setup.sh
```

### Running services locally

Bring up the docker containers:

```
docker-compose up
```

Run the Typescript build:

```
cd /provider-api
npm install
npm run build
```

### Access Services Locally

When the containers are running, you can access the following applications using these URLs:

#### Bulk FHIR Sandbox

The main entry point for the sandbox, where a user can save FHIR server configurations and trigger bulk FHIR exports, can be found at:

http://localhost:8090/provider/

#### Bulk Test Server

The Bulk Test Server, described externally at https://bulk-data.smarthealthit.org/, can be accessed locally at:

http://localhost:9443

#### Local Application

To generate new values for the "Export Configuration" , you can use the Bulk Test Server. For the Authentication `JWKS URL`, use the value `http://content-server:80/jwks/test-config.json`. You can then use the details in the "Launch Configuration" at the bottom, replacing `localhost` with `bulk-data-server`.

If desired, you can also use the following values rather than generating your own:

Application Client ID:
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InJlZ2lzdHJhdGlvbi10b2tlbiJ9.eyJqd2tzX3VybCI6Imh0dHA6Ly9jb250ZW50LXNlcnZlcjo4MC9qd2tzL3Rlc3QtY29uZmlnLmpzb24iLCJhY2Nlc3NUb2tlbnNFeHBpcmVJbiI6MTUsImlhdCI6MTY0OTM2MTAyMH0.Z_-BSnKWHaj_VYtcseld2wwVnnTIqFZe6XLdVmVdzqw`

FHIR URL:
`http://bulk-data-server:9443/eyJlcnIiOiIiLCJwYWdlIjoxMDAwMCwiZHVyIjoxLCJ0bHQiOjE1LCJtIjoxLCJzdHUiOjQsImRlbCI6MH0=/fhir`

Auth URL:
`http://bulk-data-server:9443/auth/token`

Group ID:
`group-id-1`

### Deploying to Ubuntu

```
sudo apt install nodejs
sudo apt install npm
```

Install Docker:
https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository

Install docker-compose:

```
sudo apt install docker-compose
```

Next, `git clone` this repository and `cd` into its root.

And...

```
sudo docker compose up (** not docker-compose up)
```

And that's it!

For any questions about the FHIR Questionnaire or Bulk FHIR Export POCs, please send email to: CMMI_HE_info@cms.hhs.gov.
