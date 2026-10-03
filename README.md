# Domain / Business-Name Checker

A simple browser-based tool that checks common domain versions of a business name.

## What it does

The user enters a business name or domain, and the tool checks:

- `.com`
- `.pk`
- `.com.pk`

The tool cleans the input before checking the domains.

If the name appears to be taken, the tool also suggests alternative business names and checks their domain versions.

## How to use

1. Enter a business name or domain.
2. Click the **Check** button.
3. Wait while the domains are being checked.
4. View the results for `.com`, `.pk`, and `.com.pk`.
5. If the domain appears to be taken, check the suggested alternatives.

## How it works

The project uses DNS-over-HTTPS to check domain names.

JavaScript sends DNS requests using the Fetch API and reads the JSON response.

The application uses the DNS response as a signal to determine whether a domain appears to be available or already resolving.

## Limitation

DNS resolution is a strong signal, but it is not a 100% guarantee that a domain is registered or unregistered.

A registered domain may not currently resolve.

Confirm availability with a domain registrar before registering a domain.

## Technologies

- HTML
- CSS
- JavaScript
- Fetch API
- DNS-over-HTTPS