import './CarSelector.css';

class CarSelector {
    constructor(cars = {}) {
        this.selector = document.createElement('div');
        this.selector.id = 'car-selector';
        this.selectedCar = null;

        Object.entries(cars).forEach(([carColor, carSrc]) => {
            const carLabel = document.createElement('label');
            const carOption = document.createElement('input');
            const carImg = document.createElement('img');

            carOption.type = 'radio';
            carOption.name = 'car';
            carOption.value = carColor;
            carOption.hidden = true;
            carOption.classList.add('car-option');
            carImg.src = carSrc;
            carImg.alt = `${carColor} car`;
            carOption.onchange = () => this.selectedCar = carColor;
            
            carLabel.append(carOption, carImg);
            this.selector.append(carLabel);
        });
    }
}

export default CarSelector;