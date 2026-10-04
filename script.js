const form = document.getElementById('domainForm');
const input = document.getElementById('domainInput');
const resultContainer = document.getElementById('result');
const alternativesContainer = document.getElementById('alternatives');
const checkButton = form.querySelector("button");


function cleanDomainInput(value) {
    let domain = value.trim();

    domain = domain.toLowerCase();

    domain = domain.replace(/^https?:\/\//, "");

    domain = domain.replace(/^www\./, "");

    domain = domain.replace(/\s+/g, "");

    domain = domain.replace(/\.(com\.pk|com|pk)$/, "");

    return domain;
}

form.addEventListener('submit', async (event) => {

    event.preventDefault();

    checkButton.disabled = true;
    checkButton.textContent = "Checking...";

    try {

        const domain = cleanDomainInput(input.value);

        const domains = [
            `${domain}.com`,
            `${domain}.pk`,
            `${domain}.com.pk`
        ];

        // Clear previous results
        resultContainer.innerHTML = "";
        alternativesContainer.innerHTML = "";

        // Show loading message
        resultContainer.textContent = "Checking...";

        // Check all three domains
        const promises = domains.map((currentDomain) => {
            return checkDomainAvailability(currentDomain);
        });

        const results = await Promise.all(promises);

        // Clear loading message
        resultContainer.innerHTML = "";

        // Display domain results
        domains.forEach((currentDomain, index) => {

            const resultItem = document.createElement("p");

            if (results[index] === true) {

                resultItem.textContent =
                    `${currentDomain} - Available`;

                resultItem.style.color = "green";

            } else if (results[index] === false) {

                resultItem.textContent =
                    `${currentDomain} - Taken`;

                resultItem.style.color = "red";

            } else {

                resultItem.textContent =
                    `${currentDomain} - Could not check right now`;

                resultItem.style.color = "orange";
            }

            resultContainer.appendChild(resultItem);
        });

        // Check alternatives if .com is taken
        if (results[0] === false) {

            const availableAlternatives =
                await findAvailableAlternatives(domain);

            const suggestions =
                availableAlternatives.slice(0, 5);

            if (suggestions.length > 0) {

                alternativesContainer.innerHTML =
                    "<h3>Available alternatives:</h3>";

                suggestions.forEach((alternative) => {

                    const item =
                        document.createElement("p");

                    item.textContent = alternative;

                    alternativesContainer.appendChild(item);
                });
            }
        }

    } catch (error) {

        console.error(error);

        resultContainer.innerHTML = "";

        const errorMessage =
            document.createElement("p");

        errorMessage.textContent =
            "Something went wrong. Please try again.";

        errorMessage.style.color = "orange";

        resultContainer.appendChild(errorMessage);

    } finally {

        // Always enable the button again
        checkButton.disabled = false;
        checkButton.textContent = "Check";
    }

});

async function checkDomainAvailability(domain) {
    try {
        const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
        if (!response.ok) {
            throw new Error("DNS request failed");
        }
        const data = await response.json();
        console.log('DNS response:', data);

        if (data.Answer) {
            return false;
        }

        if (data.Status === 3) {
            return true;
        }

        return null;

    } catch (error) {
        console.error('Error checking domain availability:', error);
        return null;
    }

}

function generateAlternatives(name) {
    return [
        `${name}app`,
        `get${name}`,
        `${name}online`,
        `try${name}`,
        `${name}hub`

    ];
};


async function findAvailableAlternatives(name) {

    const alternatives = generateAlternatives(name);

    const domains = [];

    alternatives.forEach((alternative) => {
        domains.push(`${alternative}.com`);
        domains.push(`${alternative}.pk`);
        domains.push(`${alternative}.com.pk`);
    });

    const promises = domains.map((domain) => {
        return checkDomainAvailability(domain);
    });

    const results = await Promise.all(promises);

    return domains.filter((domain, index) => {
        return results[index] === true;
    });
}