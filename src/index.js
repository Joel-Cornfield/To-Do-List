import './styles.css';

function component() {
  const element = document.createElement('div');
  element.textContent = 'Hello, Project Template!';
  return element;
}

document.getElementById('app').appendChild(component());
