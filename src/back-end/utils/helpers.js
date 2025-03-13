const generatePrompt = async () => {
    try {
        const response = await fetch('https://hipsum.co/api/?type=hipster-centric&sentences=3');
        const data = await response.json();
        // api sends an array
        return data[0];
    } catch (error) {
        console.error('Encountered error generating a paragraph', error);
        return `Isn't it splendid to think of all the things there are to find out about? 
                It just makes me feel glad to be alive-it's such 
                an interesting world. It wouldn't be half so interesting if 
                we knew all about everything, would it?`.replace(/\s+/g, ' ');
    }
}

export default generatePrompt;