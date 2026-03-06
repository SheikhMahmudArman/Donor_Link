import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EligibilityChecker.css';

// ── Storage Keys ──
const FORM_KEY = 'blood-donor-eligibility-form';
const SUBMITTED_KEY = 'blood-donor-eligibility-submitted';

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

  // ── Submitted State (one-time form) ──
  const [isSubmitted, setIsSubmitted] = useState(() => {
    return localStorage.getItem(SUBMITTED_KEY) === 'true';
  });

  // ── Form States ──
  const [step, setStep] = useState(1);
  const [permanentDisqual, setPermanentDisqual] = useState(false);
  const [basicEligible, setBasicEligible] = useState(false);

  // Step 1
  const [step1Answers, setStep1Answers] = useState({});

  // Step 2
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [lastDonation, setLastDonation] = useState('never');
  const [feelingWell, setFeelingWell] = useState(null);
  const [pregnantOrRecentBirth, setPregnantOrRecentBirth] = useState(null);

  // Location
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [cityArea, setCityArea] = useState('');

  // ── Load saved form data on mount ──
  useEffect(() => {
    const saved = localStorage.getItem(FORM_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setStep(data.step || 1);
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
        console.warn('Failed to load saved eligibility form', err);
      }
    }
  }, []);

  // ── Save form data whenever relevant state changes ──
  useEffect(() => {
    if (isSubmitted) return; // no need to keep saving after final submission

    const data = {
      step,
      permanentDisqual,
      basicEligible,
      step1Answers,
      age,
      weight,
      lastDonation,
      feelingWell,
      pregnantOrRecentBirth,
      division,
      district,
      cityArea,
    };

    localStorage.setItem(FORM_KEY, JSON.stringify(data));
  }, [
    step, permanentDisqual, basicEligible, step1Answers,
    age, weight, lastDonation, feelingWell, pregnantOrRecentBirth,
    division, district, cityArea, isSubmitted
  ]);

  // ── Helpers ──
  const markAsSubmitted = () => {
    localStorage.setItem(SUBMITTED_KEY, 'true');
    setIsSubmitted(true);
  };

  const handleStep1Change = (id, value) => {
    setStep1Answers(prev => ({ ...prev, [id]: value }));
  };

  const step1Complete = () => {
    const hasYes = Object.values(step1Answers).some(val => val === 'yes');
    setPermanentDisqual(hasYes);
    setStep(hasYes ? 3 : 2);
  };

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
    markAsSubmitted(); // Form is now final — cannot be changed
  };

  const goHome = () => navigate('/homepage');
  const goToDonate = () => navigate('/donate');

  const resetForm = () => {
    localStorage.removeItem(FORM_KEY);
    localStorage.removeItem(SUBMITTED_KEY);
    setIsSubmitted(false);
    setStep(1);
    setPermanentDisqual(false);
    setBasicEligible(false);
    setStep1Answers({});
    setAge('');
    setWeight('');
    setLastDonation('never');
    setFeelingWell(null);
    setPregnantOrRecentBirth(null);
    setDivision('');
    setDistrict('');
    setCityArea('');
  };

  const allStep1Answered = dealBreakers.every(q => step1Answers[q.id] !== undefined);

  // ── Render ──
  if (isSubmitted) {
    return (
      <div className="eligibility-page">
        <div className="hero">
          <h1>Thank You</h1>
          <p>You have already completed the blood donor eligibility check.</p>
        </div>

        <div className="content-wrapper" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p>This form can only be submitted once.</p>
          <button className="btn primary large" onClick={goHome}>
            Go to Home Page
          </button>
          {/* Optional: allow admin/debug reset */}
          {/* <button onClick={resetForm} style={{ marginTop: '2rem', color: '#666' }}>
            Reset form (for testing)
          </button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="eligibility-page">
      <div className="hero">
        <h1>Blood Donor Eligibility Checker</h1>
        <p>Help save lives — check if you can donate today</p>
      </div>

      <div className="content-wrapper">
        {step === 1 && (
          <div className="card">
            <h2>Step 1: Permanent Disqualifiers</h2>
            <p className="warning">
              If you answer <strong>YES</strong> to any question below, you cannot donate blood.
            </p>

            {dealBreakers.map(q => (
              <div key={q.id} className="question">
                <div className="question-label">{q.label}</div>
                <div className="radio-group custom-radio">
                  <label className={`radio-box ${step1Answers[q.id] === 'yes' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name={q.id}
                      value="yes"
                      checked={step1Answers[q.id] === 'yes'}
                      onChange={() => handleStep1Change(q.id, 'yes')}
                    />
                    <span>Yes</span>
                  </label>
                  <label className={`radio-box ${step1Answers[q.id] === 'no' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name={q.id}
                      value="no"
                      checked={step1Answers[q.id] === 'no'}
                      onChange={() => handleStep1Change(q.id, 'no')}
                    />
                    <span>No</span>
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

        {step === 2 && (
          <div className="card">
            <h2>Step 2: Basic Eligibility & Location</h2>

            <div className="form-grid">
              {/* Age */}
              <div>
                <label className="input-label">Your age (years)</label>
                <input
                  type="number"
                  min="17"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="large-input"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="input-label">Your weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  min="45"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="large-input"
                />
              </div>

              {/* Last donation */}
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

              {/* Feeling well */}
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

              {/* Pregnant */}
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
            {permanentDisqual ? (
              <>
                <h2 className="fail">Not Eligible to Donate</h2>
                <p className="permanent-note">
                  You are <strong>permanently deferred</strong> from donating blood.
                </p>
                <p>You can still receive blood if needed in the future.</p>
              </>
            ) : basicEligible ? (
              <>
                <h2 className="success">You appear eligible to donate!</h2>
                <p>Based on your answers, you meet the basic requirements.</p>
                <p className="note">
                  Final eligibility will be confirmed at the donation center.
                </p>
                <p className="highlight">Thank you for wanting to save lives!</p>
              </>
            ) : (
              <>
                <h2 className="fail">Currently Not Eligible</h2>
                <p>You do not meet one or more requirements at this moment.</p>
                <p>You may be eligible later (after waiting period, recovery, etc.).</p>
              </>
            )}

            <button className="btn secondary large" onClick={goHome}>
              Go to Home Page
            </button>
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