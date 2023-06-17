import "./Style.css"
import { useReducer } from "react"
import DigitButton from "./Dbutton"
import OperationButton from "./Opbutton"

export const ACTIONS = {
    ADD_DIGIT: "add-digit",
    CHOOSE_OPERATION: "choose-operation",
    CLEAR: "clear",
    DELETE_DIGIT: "delete-digit",
    EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    currentOperand: payload.digit,
                    overwrite: false,
                }
            }
            if (payload.digit === "0" && state.currentOperand === "0") {
                return state
            }
            if (payload.digit === "." && state.currentOperand.includes(".")) {
                return state
            }

            return {
                ...state,
                currentOperand: `${state.currentOperand || ""}${payload.digit}`,
            }
        case ACTIONS.CHOOSE_OPERATION:
            if (state.currentOperand == null && state.previousOperand == null) {
                return state
            }

            if (state.currentOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                }
            }

            if (state.previousOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    previousOperand: state.currentOperand,
                    currentOperand: null,
                }
            }

            return {
                ...state,
                previousOperand: evaluate(state),
                operation: payload.operation,
                currentOperand: null,
            }
        case ACTIONS.CLEAR:
            return {}
        case ACTIONS.DELETE_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    currentOperand: null,
                }
            }
            if (state.currentOperand == null) return state
            if (state.currentOperand.length === 1) {
                return { ...state, currentOperand: null }
            }

            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1),
            }
        case ACTIONS.EVALUATE:
            if (
                state.operation == null ||
                state.currentOperand == null ||
                state.previousOperand == null
            ) {
                return state
            }

            return {
                ...state,
                overwrite: true,
                previousOperand: null,
                operation: null,
                currentOperand: evaluate(state),
            }
    }
}

function evaluate({ currentOperand, previousOperand, operation }) {
    const prev = parseFloat(previousOperand)
    const current = parseFloat(currentOperand)
    if (isNaN(prev) || isNaN(current)) return ""
    let computation = ""
    switch (operation) {
        case "+":
            computation = prev + current
            break
        case "-":
            computation = prev - current
            break
        case "*":
            computation = prev * current
            break
        case "÷":
            computation = prev / current
            break
    }

    return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0,
})
function formatOperand(operand) {
    if (operand == null) return
    const [integer, decimal] = operand.split(".")
    if (decimal == null) return INTEGER_FORMATTER.format(integer)
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
    const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
        reducer,
        {}
    )

    return (
        <div className="calculator-grid">
            <table border={1} className="myTable">
        <thead>
          <tr>
            <td colSpan={4}>
            <div className='output'>
              <div className='previousOperand'>{formatOperand(previousOperand)} {operation}</div>
              <div className='currentOperand'>{formatOperand(currentOperand)}</div>
            </div>
            </td>
          </tr>
      </thead>
        <tbody>
        <tr>
          <td colSpan="2">
              <button
                className="spanTwo lighter"
                onClick={() => dispatch({ type: ACTIONS.CLEAR })}
              >
                AC
              </button>
          </td>
          <td>
            <button className='lighter'  onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
              DEL
              </button>
          </td>
          <td>
            <OperationButton operation="÷" dispatch={dispatch} />
          </td>
        </tr>
        <tr>
          <td>
          <DigitButton digit="1" dispatch={dispatch} />
            {/* <button className='normal'>1</button> */}
          </td>
          <td>
          <DigitButton digit="2" dispatch={dispatch} />

            {/* <button className='normal'>2</button> */}
          </td>
          <td>
          <DigitButton digit="3" dispatch={dispatch} />

            {/* <button className='normal'>3</button> */}
          </td>
          <td>
          <OperationButton operation="*" dispatch={dispatch} />

            {/* <button className='darker'>*</button> */}
          </td>
        </tr>
        <tr>
          <td>
          <DigitButton digit="4" dispatch={dispatch} />

            {/* <button className='normal'>4</button> */}
          </td>
          <td>
          <DigitButton digit="5" dispatch={dispatch} />
            {/* <button className='normal'>5</button> */}
          </td>
          <td>
          <DigitButton digit="6" dispatch={dispatch} />
            {/* <button className='normal'>6</button> */}
          </td>
          <td>
          <OperationButton operation="+" dispatch={dispatch} />
            {/* <button className='darker'>+</button> */}
          </td>
        </tr>
        <tr>
          <td>
          <DigitButton digit="7" dispatch={dispatch} />
            {/* <button className='normal'>7</button>       */}
          </td>
          <td>
          <DigitButton digit="8" dispatch={dispatch} />

            {/* <button className='normal'>8</button> */}
          </td>
          <td>
          <DigitButton digit="9" dispatch={dispatch} />
            {/* <button className='normal'>9</button> */}
          </td>
          <td>
          <OperationButton operation="-" dispatch={dispatch} />
            {/* <button className='darker'>-</button> */}
          </td>
        </tr>
        <tr>
          <td>
          <DigitButton digit="0" dispatch={dispatch} />
            {/* <button className='normal'>.</button> */}
          </td>
          <td>
          <DigitButton digit="." dispatch={dispatch} />
            {/* <button className='normal'>0</button> */}
          </td>
          <td colSpan="2">
            <button className='spanTwo pinkB' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
          </td>
        </tr> 
        </tbody>
      </table>
        </div>
    )
}

export default App