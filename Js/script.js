const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-cad")[index];
        const imgElement = imgCard.querySelector("img");

        const aiGeneratedImage = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImage;

        imgElement.onload = () => {
            imgCard.classList.remove("loading");
        }
    });
}

const OPENAI_API_KEY = "";

const generateAiImages = async (userPrompt, imgQuantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(imgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response:", errorData);
            throw new Error(errorData.error.message || "IMAGE NOT GENERATED PLEASE TRY AGAIN");
        }
        const { data } = await response.json();
        updateImageCard(data);
    } catch (error) {
        console.error("Request failed:", error.message);
        alert(error.message);
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();
    const userPrompt = e.target[0].value;
    const imgQuantity = e.target[1].value;

    const imgCardMarkUp = Array.from({ length: imgQuantity }, () =>
        `<div class="img-cad loading">
                <img src="images/loader.svg" alt="">
                <a href="#" class="download-btn">
                    <img src="images/download.svg" alt="">
                </a>
            </div>`
    ).join("");

    imageGallery.innerHTML = imgCardMarkUp;
    generateAiImages(userPrompt, imgQuantity);
}

generateForm.addEventListener("submit", handleFormSubmission);


