const generatePrompt = async () => {
    try {
        const response = await fetch('https://hipsum.co/api/?type=hipster-centric&sentences=3');
        const data = await response.json();
        // api sends an array
        return data[0];
    } catch (error) {
        console.error('Encountered error generating a paragraph', error);
        return;
    }
}

export default generatePrompt;