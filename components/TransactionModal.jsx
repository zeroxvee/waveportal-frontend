import React, { useContext, useState, useEffect } from "react"
import modalContext from "./modalContext"
import contractFunctionContext from "./contractFunctionContext"
import Modal from "react-modal"
import { Blocks } from "react-loader-spinner"

const TransactionModal = ({ data, error, isError, isSuccess, isIdle, isLoading }) => {
    const { isModal, setModal } = useContext(modalContext)
    const { functionExecuted, setFunctionExecuted } = useContext(contractFunctionContext)

    const errorMessage = error ? error.error.data.message : ""
    const txHashLink = data ? `https://goerli.etherscan.io/tx/${data.hash}` : ""
    const txHash = data
        ? data.hash.slice(0, 10).concat("...").concat(data.hash.slice(-9, data.hash.length))
        : ""

    return (
        <Modal
            appElement={document.getElementById("root") || undefined}
            isOpen={isModal}
            className="w-fit"
            ariaHideApp={false}
            style={{
                content: {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    border: "1px solid #ccc",
                    background: "#fff",
                    overflow: "auto",
                    WebkitOverflowScrolling: "touch",
                    borderRadius: "4px",
                    outline: "none",
                    padding: "20px",
                    transform: "translate(-50%, -50%)",
                    color: "#111827",
                },
            }}
        >
            <div className="" id="transaction-modal">
                <div className="text-center">
                    <div className="flex flex-col-reverse">
                        <div className="justify-between text-s">
                            <ul className="steps w-screen sm:w-fit">
                                <li
                                    data-content={
                                        isIdle || isLoading || isSuccess ? "✓" : isError ? "✕" : ""
                                    }
                                    className={
                                        isIdle || isLoading || isSuccess
                                            ? "step step-info"
                                            : isError
                                            ? "step step-error"
                                            : "step"
                                    }
                                >
                                    Initiating
                                </li>
                                <li
                                    data-content={
                                        isLoading || isSuccess ? "✓" : isError ? "✕" : ""
                                    }
                                    className={
                                        isLoading || isSuccess
                                            ? "step step-info"
                                            : isError
                                            ? "step step-error"
                                            : "step"
                                    }
                                >
                                    Waiting for confirmation
                                </li>
                                <li
                                    data-content={isSuccess ? "✓" : isError ? "✕" : ""}
                                    className={
                                        isSuccess
                                            ? "step step-info"
                                            : isError
                                            ? "step step-error"
                                            : "step"
                                    }
                                >
                                    Complete
                                </li>
                            </ul>
                        </div>
                    </div>
                    <h2 className="text-3xl mt-8 mb-6  justify-center flex">
                        {isLoading || isIdle ? (
                            <Blocks
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="blocks-loading"
                                wrapperStyle={{}}
                                wrapperClass="blocks-wrapper"
                            />
                        ) : isSuccess ? (
                            <div>Request Completed</div>
                        ) : error ? (
                            <div>{errorMessage}</div>
                        ) : (
                            ""
                        )}
                    </h2>
                    <div className="border-slate-400 border-solid my-4">
                        <div className="m-6 text-left">
                            <div className="grid mt-2">
                                <p className="text-base col-start-1 ">Transaction Type:</p>
                                <p className="text-base col-start-2 col-end-7">
                                    {functionExecuted}
                                </p>
                                <p className="text-base col-start-1">Hash: </p>
                                <a
                                    href={txHashLink}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    className="col-start-2 col-end-7"
                                >
                                    {txHash}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-2 justify-center">
                    <button
                        onClick={() => setModal(false)}
                        type="button"
                        className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default TransactionModal
