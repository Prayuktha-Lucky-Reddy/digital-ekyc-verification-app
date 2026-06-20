import { useState, useRef } from "react";
import Webcam from "react-webcam";
import "./App.css";

function App() {
  const [step, setStep] = useState(1);
  const API = "https://digital-ekyc-verification-app-production.up.railway.app"

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] =
    useState("");

  const [name, setName] = useState("");
  const [documentType, setDocumentType] =
    useState("Aadhaar Card");

  const [documentImage, setDocumentImage] =
    useState(null);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const webcamRef = useRef(null);

  const [capturedSelfie, setCapturedSelfie] =
    useState(null);

  const sendOtp = async () => {
    const response = await fetch(
      `${API}/send-otp?phone=${phone}`,
      {
        method: "POST"
      }
    );

    const data = await response.json();

    if (data.success) {
      setOtpSent(true);
      setGeneratedOtp(data.otp);
    } else {
      alert(data.message);
    }
  };

  const verifyOtp = async () => {
    const response = await fetch(
      `${API}/verify-otp?phone=${phone}&otp=${otp}`,
      {
        method: "POST"
      }
    );

    const data = await response.json();

    if (data.verified) {
      setStep(2);
    } else {
      alert("Invalid OTP");
    }
  };

  const captureSelfie = () => {
    const imageSrc =
      webcamRef.current.getScreenshot();

    setCapturedSelfie(imageSrc);
  };

  const dataURLtoFile = (
    dataurl,
    filename
  ) => {
    const arr = dataurl.split(",");

    const mime =
      arr[0].match(/:(.*?);/)[1];

    const bstr = atob(arr[1]);

    let n = bstr.length;

    const u8arr =
      new Uint8Array(n);

    while (n--) {
      u8arr[n] =
        bstr.charCodeAt(n);
    }

    return new File(
      [u8arr],
      filename,
      { type: mime }
    );
  };

  const verifyUser = async () => {
    setLoading(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "name",
        name
      );

      formData.append(
        "document_image",
        documentImage
      );

      const selfieFile =
        dataURLtoFile(
          capturedSelfie,
          "selfie.jpg"
        );

      formData.append(
        "selfie_image",
        selfieFile
      );

      const response =
        await fetch(
          '${API}/verify-user',
          {
            method: "POST",
            body: formData
          }
        );

      const data =
        await response.json();

      setResult(data);

      setStep(5);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      <h1 className="page-title">
        Digital e-KYC Verification
      </h1>

      <div className="card">

        <div className="progress-container">

          <p className="subtitle">
            Step {step} of 5
          </p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width:
                  `${(step / 5) * 100}%`
              }}
            />
          </div>

        </div>

        {step === 1 && (
          <div className="section">

            <label>
              Phone Number
            </label>

            <input
              type="text"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
            />

            <br />
            <br />

            {!otpSent ? (
              <div className="next-only">

                <button
                  onClick={sendOtp}
                  disabled={
                    phone.length !== 10
                  }
                >
                  Send OTP
                </button>

              </div>
            ) : (
              <>
                <label>
                  OTP
                </label>
                <p>
                  Demo OTP: {generatedOtp}
                </p>

                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value
                    )
                  }
                />

                <br />
                <br />

                <div className="button-row">

                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                  >
                    Back
                  </button>

                  <button
                    onClick={verifyOtp}
                  >
                    Verify OTP
                  </button>

                </div>
              </>
            )}

          </div>
        )}

        {step === 2 && (
          <div className="section">

            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />

            <br />
            <br />

            <label>
              Document Type
            </label>

            <select
              value={documentType}
              onChange={(e) =>
                setDocumentType(
                  e.target.value
                )
              }
            >
              <option>
                Aadhaar Card
              </option>

              <option>
                PAN Card
              </option>

              <option>
                Passport
              </option>

              <option>
                Driving Licence
              </option>
            </select>

            <br />
            <br />

            <div className="button-row">

              <button
                onClick={() =>
                  setStep(1)
                }
              >
                Back
              </button>

              <button
                onClick={() =>
                  setStep(3)
                }
                disabled={
                  !name.trim()
                }
              >
                Next
              </button>

            </div>

          </div>
        )}

        {step === 3 && (
          <div className="section">

            <label>
              Upload {documentType}
            </label>

            <br />

            <input
              type="file"
              onChange={(e) =>
                setDocumentImage(
                  e.target.files[0]
                )
              }
            />

            <br />
            <br />

            <div className="button-row">

              <button
                onClick={() =>
                  setStep(2)
                }
              >
                Back
              </button>

              <button
                onClick={() =>
                  setStep(4)
                }
                disabled={
                  !documentImage
                }
              >
                Next
              </button>

            </div>

          </div>
        )}

        {step === 4 && (
          <div className="section">

            <label>
              Capture Selfie
            </label>

            <br />

            {!capturedSelfie ? (
              <>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="webcam"
                />

                <div className="capture-container">

                  <button
                    onClick={
                      captureSelfie
                    }
                  >
                    Capture Selfie
                  </button>

                </div>
              </>
            ) : (
              <>
                <img
                  src={capturedSelfie}
                  className="webcam"
                />

                <div className="capture-container">

                  <button
                    onClick={() =>
                      setCapturedSelfie(
                        null
                      )
                    }
                  >
                    Recapture
                  </button>

                </div>
              </>
            )}

            <br />

            <div className="button-row">

              <button
                onClick={() =>
                  setStep(3)
                }
              >
                Back
              </button>

              {capturedSelfie && (
                <button
                  onClick={
                    verifyUser
                  }
                  disabled={
                    loading
                  }
                >
                  {loading
                    ? "Verifying..."
                    : "Verify"}
                </button>
              )}

            </div>

          </div>
        )}

        {step === 5 &&
          result && (
            <div className="result">

              <h2
                className={
                  result.verified
                    ? "accepted"
                    : "rejected"
                }
              >
                {result.verified
                  ? "Accepted"
                  : "Rejected"}
              </h2>
                
              <p>
                Name Match:
                {" "}
                {
                  String(
                    result.name_match
                  )
                }
              </p>

              <p>
                Face Score:
                {" "}
                {
                  result.face_score
                }
              </p>
                  
              <button
                onClick={() =>
                  window.location.reload()
                }
              >
                Start Again
              </button>

            </div>
          )}

      </div>

    </div>
  );
}

export default App;
