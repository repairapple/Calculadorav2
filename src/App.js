import React, { useState } from 'react';
import './Calculator.css';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [resetDisplay, setResetDisplay] = useState(false);
  const [activeOperation, setActiveOperation] = useState(null);
  const [expression, setExpression] = useState('');

  const handleNumberClick = (num) => {
    if (display === '0' || resetDisplay) {
      if (num === '.') {
        setDisplay('0.');
        setExpression('0.');
      } else {
        setDisplay(num);
        setExpression(prev => prev + num);
      }
      setResetDisplay(false);
    } else {
      if (num === '.' && display.includes('.')) return;
      setDisplay(display + num);
      setExpression(prev => prev + num);
    }
  };

  const handleOperationClick = (op) => {
    if (storedValue === null) {
      setStoredValue(parseFloat(display));
    } else if (operation && !resetDisplay) {
      const result = calculate();
      setStoredValue(result);
      setDisplay(String(result));
      setExpression(String(result) + ' ' + op + ' ');
    }

    if (storedValue === null || (operation && resetDisplay)) {
      setExpression(display + ' ' + op + ' ');
    }

    setOperation(op);
    setActiveOperation(op);
    setResetDisplay(true);
  };

  const calculate = () => {
    const currentValue = parseFloat(display);
    let result = 0;
    const previous = storedValue;

    switch (operation) {
      case '+':
        result = previous + currentValue;
        break;
      case '-':
        result = previous - currentValue;
        break;
      case '×':
        result = previous * currentValue;
        break;
      case '÷':
        result = previous / currentValue;
        break;
      default:
        return currentValue;
    }

    return result;
  };

  const handleEqualsClick = () => {
    if (operation === null) return;

    const result = calculate();
    setDisplay(String(result));
    setExpression(prev => prev + ' =');
    setStoredValue(null);
    setOperation(null);
    setActiveOperation(null);
    setResetDisplay(true);
  };

  const handleClearClick = () => {
    if (display === '0' && storedValue === null && operation === null) {
      // AC: limpa tudo
      setDisplay('0');
      setStoredValue(null);
      setOperation(null);
      setActiveOperation(null);
      setResetDisplay(false);
      setExpression('');
    } else {
      // C: limpa só o display atual
      setDisplay('0');
      setResetDisplay(false);
      // Remove só o último número da expressão
      if (operation !== null) {
        // Estamos no meio de uma operação: mantém "2 + " e limpa o segundo número
        const lastSpace = expression.lastIndexOf(' ');
        if (lastSpace > 0) {
          setExpression(prev => prev.substring(0, lastSpace + 1));
        } else {
          setExpression('');
        }
      } else {
        setExpression('');
      }
    }
  };

  const getClearButtonText = () => {
    if (display === '0' && storedValue === null && operation === null) {
      return 'AC';
    }
    return 'C';
  };

  const handlePlusMinusClick = () => {
    if (display !== '0') {
      const value = parseFloat(display);
      const newVal = String(value * -1);
      setDisplay(newVal);
      // Replace last number in expression
      if (expression) {
        const parts = expression.split(' ');
        if (parts.length > 0) {
          parts[parts.length - 1] = newVal;
          setExpression(parts.join(' '));
        }
      } else {
        setExpression(newVal);
      }
    }
  };

  const handlePercentageClick = () => {
    const value = parseFloat(display);
    const newVal = String(value / 100);
    setDisplay(newVal);
    if (expression) {
      const parts = expression.split(' ');
      if (parts.length > 0) {
        parts[parts.length - 1] = newVal;
        setExpression(parts.join(' '));
      }
    } else {
      setExpression(newVal);
    }
  };

  const handleBackspace = () => {
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
    } else {
      const newDisplay = display.slice(0, -1);
      setDisplay(newDisplay);
    }
    // Remove last char from expression
    if (expression) {
      setExpression(prev => prev.trimEnd().slice(0, -1));
    }
  };

  const getExpressionText = () => {
    return expression || '\u00A0';
  };

  const getDisplayText = () => {
    return display;
  };

  const Button = ({ children, onClick, className = "", type = "number", active = false }) => (
    <button
      onClick={onClick}
      className={`button ${type === 'function' ? 'button-function' :
          type === 'operator' ? 'button-operator' :
            'button-number'
        } ${active ? 'active' : ''} ${className}`}
    >
      <span>{children}</span>
    </button>
  );

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="display">
          <div className="display-expression">{getExpressionText()}</div>
          <div className="display-text">{getDisplayText()}</div>
        </div>

        <div className="buttons-grid">
          {/* Row 1 */}
          <Button onClick={handleBackspace} type="function" className="button-backspace">
            ⌫
          </Button>
          <Button onClick={handleClearClick} type="function">
            {getClearButtonText()}
          </Button>
          <Button onClick={handlePercentageClick} type="function">
            %
          </Button>
          <Button
            onClick={() => handleOperationClick('÷')}
            type="operator"
            active={activeOperation === '÷'}
          >
            ÷
          </Button>

          {/* Row 2 */}
          <Button onClick={() => handleNumberClick('7')} type="number">7</Button>
          <Button onClick={() => handleNumberClick('8')} type="number">8</Button>
          <Button onClick={() => handleNumberClick('9')} type="number">9</Button>
          <Button
            onClick={() => handleOperationClick('×')}
            type="operator"
            active={activeOperation === '×'}
          >
            ×
          </Button>

          {/* Row 3 */}
          <Button onClick={() => handleNumberClick('4')} type="number">4</Button>
          <Button onClick={() => handleNumberClick('5')} type="number">5</Button>
          <Button onClick={() => handleNumberClick('6')} type="number">6</Button>
          <Button
            onClick={() => handleOperationClick('-')}
            type="operator"
            active={activeOperation === '-'}
          >
            -
          </Button>

          {/* Row 4 */}
          <Button onClick={() => handleNumberClick('1')} type="number">1</Button>
          <Button onClick={() => handleNumberClick('2')} type="number">2</Button>
          <Button onClick={() => handleNumberClick('3')} type="number">3</Button>
          <Button
            onClick={() => handleOperationClick('+')}
            type="operator"
            active={activeOperation === '+'}
          >
            +
          </Button>

          {/* Row 5 */}
          <Button onClick={() => handleNumberClick('0')} type="number">
            0
          </Button>
          <Button onClick={handlePlusMinusClick} type="number">
            +/-
          </Button>
          <Button onClick={() => handleNumberClick('.')} type="number">
            .
          </Button>
          <Button onClick={handleEqualsClick} type="operator">
            =
          </Button>
        </div>
      </div>
    </div>
  );
}