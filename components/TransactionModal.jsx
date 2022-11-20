import { Modal, Stepper } from "@web3uikit/core"
import { useState } from "react"

const TransactionModal = () => {
    const [step, setStep] = useState(0)
    return (
        <Modal
            headerHasBottomBorder="true"
            id="regular"
            isVisible="true"
            onCancel={function noRefCheck() {}}
            onCloseButtonPressed={function noRefCheck() {}}
            onOk={function noRefCheck() {}}
            title="Transaction Progress"
        >
            <div
                style={{
                    height: "1px",
                    minHeight: "450px",
                }}
            >
                <Stepper
                    onComplete={function noRefCheck() {}}
                    onNext={function noRefCheck() {}}
                    step={1}
                    stepData={[
                        {
                            content: (
                                <p>
                                    We hope you like the content stepper, another super useful tool
                                    from the <strong>Moralis web3uiKit</strong>
                                </p>
                            ),
                            title: "Welcome to the Stepper",
                        },
                        {
                            content: (
                                <div>
                                    <p>
                                        If any button ID = next
                                        <br />
                                    </p>
                                    <button id="next">next</button>
                                    <p>
                                        It can be used to navigate
                                        <br />
                                    </p>
                                </div>
                            ),
                            title: "Learn more",
                        },
                        {
                            content: (
                                <div>
                                    <p>
                                        If any button ID = prev
                                        <br />
                                    </p>
                                    <button id="prev">prev</button>
                                    <p>
                                        It can be used to navigate too
                                        <br />
                                    </p>
                                </div>
                            ),
                            title: "Learn more",
                        },
                        {
                            content: (
                                <p>
                                    Stepper is set to 100% height so you can use a parent div to
                                    control its height and it will fill the space dynamically. This
                                    parent div is set to 450px height. This means the buttons stay
                                    fixed to the bottom in the same place always
                                </p>
                            ),
                            title: "Heights",
                        },
                        {
                            content: <p>you can pass any content, we hope you like the stepper</p>,
                            title: "Hope you enjoy",
                        },
                    ]}
                />
            </div>
        </Modal>
    )
}

export default TransactionModal
