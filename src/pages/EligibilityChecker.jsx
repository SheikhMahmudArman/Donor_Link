import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EligibilityChecker.css';

// ── Storage Keys ──
const FORM_KEY = 'blood-donor-eligibility-form';
const PERMANENT_DISQUAL_KEY = 'blood-donor-permanent-disqual';

// ── Deal Breakers (Permanent Disqualifiers) ──
const dealBreakers = [
  { id: 'hiv-aids', label: 'Have you ever tested positive for HIV/AIDS?' },
  { id: 'etretinate', label: 'Have you EVER taken Tegison® (etretinate) at any time?' },
  { id: 'growth-hormone', label: 'Ever received human pituitary-derived growth hormone?' },
  { id: 'uk-residence', label: 'Spent 3+ months in the United Kingdom (1980–1996)?' },
  { id: 'cjd', label: 'Ever diagnosed with or at risk for Creutzfeldt-Jakob disease?' },
  { id: 'dura-mater', label: 'Ever had a dura mater (brain covering) transplant?' },
];

// ── Location Data ──
const divisions = [
  'Barishal', 'Chattogram', 'Dhaka', 'Khulna', 'Mymensingh', 'Rajshahi', 'Rangpur', 'Sylhet'
];

const districtsByDivision = {
  Barishal: ['Barguna', 'Barishal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
  Chattogram: ['Bandarban', 'Brahmanbaria', 'Chandpur', 'Chattogram', 'Comilla', "Cox's Bazar", 'Feni', 'Khagrachhari', 'Lakshmipur', 'Noakhali', 'Rangamati'],
  Dhaka: ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'],
  Khulna: ['Bagerhat', 'Chuadanga', 'Jashore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],
  Mymensingh: ['Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur'],
  Rajshahi: ['Bogura', 'Joypurhat', 'Naogaon', 'Natore', 'Chapainawabganj', 'Pabna', 'Rajshahi', 'Sirajganj'],
  Rangpur: ['Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon'],
  Sylhet: ['Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'],
};

const citiesByDistrict = {
  Dhaka: ['Dhaka City North', 'Dhaka City South', 'Savar', 'Keraniganj', 'Narayanganj', 'Gazipur City', 'Other'],
  Chattogram: ['Chattogram City', "Cox's Bazar", 'Comilla City', 'Other'],
};

function EligibilityChecker() {
  const navigate = useNavigate();

  // Permanent lock only if Yes in Step 1 ever
  const [isPermanentlyLocked, setIsPermanentlyLocked] = useState(() => {
    return localStorage.getItem(PERMANENT_DISQUAL_KEY) === 'true';
  });

  // ── Form States ──
  const [step, setStep] = useState(0); // 0 = intro screen
  const [permanentDisqual, setPermanentDisqual] = useState(false);
  const [basicEligible, setBasicEligible] = useState(false);

  // Step 1 answers (yes / no / unknown)
  const [step1Answers, setStep1Answers] = useState({});

  // Step 2 fields
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [lastDonation, setLastDonation] = useState('never');
  const [feelingWell, setFeelingWell] = useState(null);
  const [pregnantOrRecentBirth, setPregnantOrRecentBirth] = useState(null);
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [cityArea, setCityArea] = useState('');

  // ── Load saved data ──
  useEffect(() => {
    const saved = localStorage.getItem(FORM_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setStep(data.step ?? 0);
        setPermanentDisqual(data.permanentDisqual || false);
        setBasicEligible(data.basicEligible || false);
        setStep1Answers(data.step1Answers || {});
        setAge(data.age || '');
        setWeight(data.weight || '');
        setLastDonation(data.lastDonation || 'never');
        setFeelingWell(data.feelingWell ?? null);
        setPregnantOrRecentBirth(data.pregnantOrRecentBirth ?? null);
        setDivision(data.division || '');
        setDistrict(data.district || '');
        setCityArea(data.cityArea || '');
      } catch (err) {
        console.warn('Failed to load saved form', err);
      }
    }

    const locked = localStorage.getItem(PERMANENT_DISQUAL_KEY) === 'true';
    setIsPermanentlyLocked(locked);
    if (locked) setStep(3); // jump to result if permanently locked
  }, []);

  // ── Save on change ──
  useEffect(() => {
    const data = {
      step,
      permanentDisqual,
      basicEligible,
      step1Answers,
      age, weight, lastDonation, feelingWell, pregnantOrRecentBirth,
      division, district, cityArea,
    };
    localStorage.setItem(FORM_KEY, JSON.stringify(data));
  }, [step, permanentDisqual, basicEligible, step1Answers, age, weight, lastDonation, feelingWell, pregnantOrRecentBirth, division, district, cityArea]);

  // ── Helpers ──
  const handleStep1Change = (id, value) => {
    setStep1Answers(prev => ({ ...prev, [id]: value }));
  };

  const step1Complete = () => {
    const hasYes = Object.values(step1Answers).some(v => v === 'yes');

    if (hasYes) {
      setPermanentDisqual(true);
      localStorage.setItem(PERMANENT_DISQUAL_KEY, 'true');
      setIsPermanentlyLocked(true);
      setStep(3);
    } else {
      setPermanentDisqual(false);
      setStep(1.5); // intermediate info screen
    }
  };

  const goToStep2 = () => setStep(2);

  const step2Complete = () => {
    const ageNum = parseInt(age, 10) || 0;
    const weightNum = parseFloat(weight) || 0;

    const eligible =
      ageNum >= 17 && ageNum <= 65 &&
      weightNum >= 45 &&
      (lastDonation === 'never' || Number(lastDonation) >= 3) &&
      feelingWell === 'yes' &&
      pregnantOrRecentBirth === 'no' &&
      !!division && !!district;

    setBasicEligible(eligible);
    setStep(3);
  };

  const goHome = () => navigate('/homepage');

  const allStep1Answered = dealBreakers.every(q => step1Answers[q.id] !== undefined);

  return (
    <div className="eligibility-page">
      <div className="hero">
        <h1>Blood Donor Eligibility Checker</h1>
        <p>Help save lives — check if you can donate today</p>
      </div>

      <div className="content-wrapper">

        {step === 0 && (
          <div className="card intro-card">
            <h2>Welcome to the Blood Donor Eligibility Checker</h2>
            <p className="warning">
              This quick check helps determine if you may be able to donate blood safely.<br /><br />
              <strong>Important:</strong> If you answer <strong>YES</strong> to any permanent disqualifier question, this will be your final result — you will not be able to change it later.<br /><br />
              If you answer No or "Didn't test" to all questions, you can come back and update your answers anytime.
            </p>
            <button className="btn primary large" onClick={() => setStep(1)}>
              Continue
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="card">
            <h2>Step 1: Permanent Disqualifiers</h2>
            <p className="warning">
              If you answer <strong>YES</strong> to any question below, you cannot donate blood ever. This result will be permanent.
            </p>

            {dealBreakers.map(q => (
              <div key={q.id} className="question">
                <div className="question-label">{q.label}</div>
                <div className="radio-group custom-radio three-options">
                  <label className={`radio-box ${step1Answers[q.id] === 'yes' ? 'selected danger' : ''}`}>
                    <input
                      type="radio"
                      name={q.id}
                      value="yes"
                      checked={step1Answers[q.id] === 'yes'}
                      onChange={() => handleStep1Change(q.id, 'yes')}
                    />
                    <span>Yes</span>
                  </label>
                  <label className={`radio-box ${step1Answers[q.id] === 'no' ? 'selected safe' : ''}`}>
                    <input
                      type="radio"
                      name={q.id}
                      value="no"
                      checked={step1Answers[q.id] === 'no'}
                      onChange={() => handleStep1Change(q.id, 'no')}
                    />
                    <span>No</span>
                  </label>
                  <label className={`radio-box ${step1Answers[q.id] === 'unknown' ? 'selected neutral' : ''}`}>
                    <input
                      type="radio"
                      name={q.id}
                      value="unknown"
                      checked={step1Answers[q.id] === 'unknown'}
                      onChange={() => handleStep1Change(q.id, 'unknown')}
                    />
                    <span>Didn't test</span>
                  </label>
                </div>
              </div>
            ))}

            <button
              className="btn primary large"
              onClick={step1Complete}
              disabled={!allStep1Answered}
            >
              Continue
            </button>
          </div>
        )}

        {step === 1.5 && (
          <div className="card info-card">
            <h2>Next: Basic Eligibility Check</h2>
            <p>
              You passed the permanent disqualifiers (no YES answers).<br /><br />
              Now we will check temporary / current eligibility factors (age, weight, recent donation, feeling well today, pregnancy status, location).<br /><br />
              <strong>Important:</strong> If you are not eligible right now, you may become eligible later — after some time passes, recovery, or other changes.<br />
              You can come back and update this section anytime.
            </p>
            <button className="btn primary large" onClick={goToStep2}>
              Continue to Basic Check
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <h2>Step 2: Basic Eligibility & Location</h2>

            <div className="form-grid">
              <div>
                <label className="input-label">Your age (years)</label>
                <input
                  type="number"
                  min="17"
                  max="65"
                  step="1"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="large-input"
                />
              </div>

              <div>
                <label className="input-label">Your weight (kg)</label>
                <input
                  type="number"
                  min="45"
                  step="0.5"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="large-input"
                />
              </div>

              <div>
                <label className="input-label">Last whole blood donation?</label>
                <select
                  value={lastDonation}
                  onChange={e => setLastDonation(e.target.value)}
                  className="large-select"
                >
                  <option value="never">Never donated</option>
                  <option value="0">Less than 3 months ago</option>
                  <option value="3">3–6 months ago</option>
                  <option value="6">More than 6 months ago</option>
                </select>
              </div>

              <div className="full-width">
                <div className="question-label">Do you feel well today? (no fever, cold, etc.)</div>
                <div className="radio-group custom-radio">
                  <label className={`radio-box ${feelingWell === 'yes' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="well"
                      value="yes"
                      checked={feelingWell === 'yes'}
                      onChange={() => setFeelingWell('yes')}
                    />
                    <span>Yes</span>
                  </label>
                  <label className={`radio-box ${feelingWell === 'no' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="well"
                      value="no"
                      checked={feelingWell === 'no'}
                      onChange={() => setFeelingWell('no')}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div className="full-width">
                <div className="question-label">
                  Are you currently pregnant or gave birth in the last 6 months?
                </div>
                <div className="radio-group custom-radio">
                  <label className={`radio-box ${pregnantOrRecentBirth === 'yes' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="preg"
                      value="yes"
                      checked={pregnantOrRecentBirth === 'yes'}
                      onChange={() => setPregnantOrRecentBirth('yes')}
                    />
                    <span>Yes</span>
                  </label>
                  <label className={`radio-box ${pregnantOrRecentBirth === 'no' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="preg"
                      value="no"
                      checked={pregnantOrRecentBirth === 'no'}
                      onChange={() => setPregnantOrRecentBirth('no')}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {/* Location */}
              <div className="full-width location-section">
                <h3>Your Location</h3>
                <div className="select-row">
                  <div>
                    <label className="input-label">Division</label>
                    <select
                      value={division}
                      onChange={e => {
                        setDivision(e.target.value);
                        setDistrict('');
                        setCityArea('');
                      }}
                      className="large-select"
                    >
                      <option value="">Select Division</option>
                      {divisions.map(div => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                  </div>

                  {division && (
                    <div>
                      <label className="input-label">District</label>
                      <select
                        value={district}
                        onChange={e => {
                          setDistrict(e.target.value);
                          setCityArea('');
                        }}
                        className="large-select"
                      >
                        <option value="">Select District</option>
                        {(districtsByDivision[division] || []).map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {(division === 'Dhaka' || division === 'Chattogram') && district && citiesByDistrict[district] && (
                    <div>
                      <label className="input-label">City / Area</label>
                      <select
                        value={cityArea}
                        onChange={e => setCityArea(e.target.value)}
                        className="large-select"
                      >
                        <option value="">Select Area (optional)</option>
                        {citiesByDistrict[district].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              className="btn primary large"
              onClick={step2Complete}
              disabled={
                !age.trim() ||
                !weight.trim() ||
                feelingWell === null ||
                pregnantOrRecentBirth === null ||
                !division ||
                !district
              }
            >
              Check Eligibility
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="card result-card">
            {permanentDisqual || isPermanentlyLocked ? (
              <>
                <h2 className="fail">Not Eligible to Donate</h2>
                <p className="permanent-note">
                  You are <strong>permanently deferred</strong> from donating blood due to one or more answers in Step 1.
                </p>
                <p>This decision is final and cannot be changed.</p>
              </>
            ) : basicEligible ? (
              <>
                <h2 className="success">You appear eligible to donate!</h2>
                <p>Based on your current answers, you meet the basic requirements.</p>
                <p className="note">Final eligibility will be confirmed at the donation center.</p>
                <p className="highlight">Thank you for wanting to save lives!</p>
              </>
            ) : (
              <>
                <h2 className="fail">Currently Not Eligible</h2>
                <p>You do not meet one or more requirements at this moment.</p>
                <p>You may be eligible later (after waiting period, recovery, etc.).</p>
              </>
            )}

            <button className="btn secondary large" onClick={goHome} style={{ marginTop: '2rem' }}>
              Go to Home Page
            </button>

            {!permanentDisqual && !isPermanentlyLocked && (
              <button className="btn outline large" onClick={() => setStep(2)} style={{ marginTop: '1rem' }}>
                Edit / Update Answers
              </button>
            )}
          </div>
        )}
      </div>

      <footer className="footer-note">
        <p>This is a general guide only. Always confirm with official blood banks (BSMMU, Red Crescent, etc.).</p>
      </footer>
    </div>
  );
}

export default EligibilityChecker;