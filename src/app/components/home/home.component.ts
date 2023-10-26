import { Component, ElementRef, Renderer2, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentOperation = '';
  previousOperation = '';
  operation: string | undefined;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  appendNumber(number: string) {
    this.currentOperation += number;
    this.updateDisplay();
  }

  chooseOperation(operation: string) {
    if (this.currentOperation === '') return;
    if (this.previousOperation !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperation = this.currentOperation;
    this.currentOperation = '';
    this.updateDisplay();
  }


  compute() {
    let computation: number;
    const prev = parseFloat(this.previousOperation);
    const current = parseFloat(this.currentOperation);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        computation = prev / current;
        break;
      default:
        return;
    }
    this.currentOperation = computation.toString();
    this.operation = undefined;
    this.previousOperation = '';
    this.updateDisplay();
  }

  clear() {
    this.currentOperation = '';
    this.previousOperation = '';
    this.operation = undefined;
    this.updateDisplay();
  }

  delete() {
    this.currentOperation = this.currentOperation.slice(0, -1);
    this.updateDisplay();
  }

  updateDisplay() {
    const currentOperationElement = this.el.nativeElement.querySelector('#current-operation');
    if (currentOperationElement) {
      this.renderer.setProperty(currentOperationElement, 'innerText', this.currentOperation);
    }
    const previousOperationElement = this.el.nativeElement.querySelector('#previous-operation');
    if (previousOperationElement) {
      this.renderer.setProperty(
        previousOperationElement,
        'innerText',
        this.previousOperation + (this.operation ? ' ' + this.operation : '')
      );
    }
  }


  ngOnInit() {
    const buttons = this.el.nativeElement.querySelectorAll('.number');
    buttons.forEach((button: HTMLButtonElement) => {
      button.addEventListener('click', () => {
        const buttonText = button.innerText;
        if (isNaN(Number(buttonText))) {
          if (buttonText === '.') {
            this.appendNumber(buttonText);
          } else if (buttonText === '=') {
            this.compute();
          } else if (['+', '-', '*', '/'].includes(buttonText)) {
            this.chooseOperation(buttonText);
          } else if (buttonText === 'C') {
            this.clear();
          } else if (buttonText === 'DEL') {
            this.delete();
          }
        } else {
          this.appendNumber(buttonText);
        }
      });
    });
  }
}
