import React, { useState } from 'react';
import './Calculator.css';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [resetDisplay, setResetDisplay] = useState(false);

  // Function to format numbers with thousand separators (dots)
  const formatNumber = (num) => {
    if (num === '0' || num === '') return '0';
    
    // Handle decimal numbers
    if (num.includes('.')) {
      const [integerPart, decimalPart] = num.split('.');
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return `${formattedInteger},${decimalPart}`;
    }
    
    // Format integer numbers with dots as thousand separators
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Function to remove formatting for calculations
  const unformatNumber = (formattedNum) => {
    return formattedNum.replace(/\./g, '').replace(',', '.');
  };

  const handleNumberClick = (num) => {
    if (display === '0' || resetDisplay) {
      setDisplay(formatNumber(num));
      setResetDisplay(false);
    } else {
      const unformattedDisplay = unformatNumber(display);
      const newValue = unformattedDisplay + num;
      setDisplay(formatNumber(newValue));
    }
  };

  const handleDecimalClick = () => {
    if (resetDisplay) {
      setDisplay('0,');
      setResetDisplay(false);
      return;
    }
    if (!display.includes(',')) {
      setDisplay(display + ',');
    }
  };

  const handleOperationClick = (op) => {
    const unformattedDisplay = unformatNumber(display);
    if (storedValue === null) {
      setStoredValue(parseFloat(unformattedDisplay));
    } else if (!resetDisplay) {
      const result = calculate();
      setStoredValue(result);
      setDisplay(formatNumber(String(result)));
    }
    setOperation(op);
    setResetDisplay(true);
  };

  const calculate = () => {
    const unformattedDisplay = unformatNumber(display);
    const currentValue = parseFloat(unformattedDisplay);
    let result = 0;
    
    switch (operation) {
      case '+':
        result = storedValue + currentValue;
        break;
      case '-':
        result = storedValue - currentValue;
        break;
      case '×':
        result = storedValue * currentValue;
        break;
      case '÷':
        result = storedValue / currentValue;
        break;
      default:
        return currentValue;
    }
    
    return result;
  };

  const handleEqualsClick = () => {
    if (operation === null || resetDisplay) return;
    
    const result = calculate();
    setDisplay(formatNumber(String(result)));
    setStoredValue(null);
    setOperation(null);
    setResetDisplay(true);
  };

  const handleClearClick = () => {
    if (display === '0' && storedValue === null && operation === null) {
      // Se já está limpo, não faz nada (AC)
      return;
    } else if (display !== '0' && storedValue !== null) {
      // Se há operação em andamento, limpa apenas o display (C)
      setDisplay('0');
      setResetDisplay(false);
    } else {
      // Limpa tudo (AC)
      setDisplay('0');
      setStoredValue(null);
      setOperation(null);
      setResetDisplay(false);
    }
  };

  // Função para determinar se deve mostrar AC ou C
  const getClearButtonText = () => {
    if (display === '0' && storedValue === null && operation === null) {
      return 'AC';
    }
    return 'C';
  };

  const handlePlusMinusClick = () => {
    if (display !== '0') {
      const unformattedDisplay = unformatNumber(display);
      const negativeValue = -parseFloat(unformattedDisplay);
      setDisplay(formatNumber(String(negativeValue)));
    }
  };

  const handlePercentageClick = () => {
    const unformattedDisplay = unformatNumber(display);
    const value = parseFloat(unformattedDisplay) / 100;
    setDisplay(formatNumber(String(value)));
  };

  const Button = ({ children, onClick, className = "", type = "number" }) => (
    <button
      onClick={onClick}
      className={`button ${
        type === 'function' ? 'button-function' : 
        type === 'operator' ? 'button-operator' : 
        'button-number'
      } ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="calculator-container">
      <div className="calculator">
        {/* Display */}
        <div className="display">
          <div className="display-text">{display}</div>
        </div>
        
        {/* Buttons Grid */}
        <div className="buttons-grid">
          {/* Row 1 */}
          <Button 
            onClick={handleClearClick}
            type="function"
          >
            {getClearButtonText()}
          </Button>
          <Button 
            onClick={handlePlusMinusClick}
            type="function"
          >
            +/-
          </Button>
          <Button 
            onClick={handlePercentageClick}
            type="function"
          >
            %
          </Button>
          <Button 
            onClick={() => handleOperationClick('÷')}
            type="operator"
          >
            ÷
          </Button>
          
          {/* Row 2 */}
          <Button 
            onClick={() => handleNumberClick('7')}
            type="number"
          >
            7
          </Button>
          <Button 
            onClick={() => handleNumberClick('8')}
            type="number"
          >
            8
          </Button>
          <Button 
            onClick={() => handleNumberClick('9')}
            type="number"
          >
            9
          </Button>
          <Button 
            onClick={() => handleOperationClick('×')}
            type="operator"
          >
            ×
          </Button>
          
          {/* Row 3 */}
          <Button 
            onClick={() => handleNumberClick('4')}
            type="number"
          >
            4
          </Button>
          <Button 
            onClick={() => handleNumberClick('5')}
            type="number"
          >
            5
          </Button>
          <Button 
            onClick={() => handleNumberClick('6')}
            type="number"
          >
            6
          </Button>
          <Button 
            onClick={() => handleOperationClick('-')}
            type="operator"
          >
            -
          </Button>
          
          {/* Row 4 */}
          <Button 
            onClick={() => handleNumberClick('1')}
            type="number"
          >
            1
          </Button>
          <Button 
            onClick={() => handleNumberClick('2')}
            type="number"
          >
            2
          </Button>
          <Button 
            onClick={() => handleNumberClick('3')}
            type="number"
          >
            3
          </Button>
          <Button 
            onClick={() => handleOperationClick('+')}
            type="operator"
          >
            +
          </Button>
          
          {/* Row 5 */}
          <Button 
            onClick={() => handleNumberClick('0')}
            type="number"
            className="button-zero"
          >
            0
          </Button>
          <Button 
            onClick={handleDecimalClick}
            type="number"
          >
            .
          </Button>
          <Button 
            onClick={handleEqualsClick}
            type="operator"
          >
            =
          </Button>
        </div>
      </div>
    </div>
  );
}