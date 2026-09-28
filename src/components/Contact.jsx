import React, { useState, useEffect } from 'react';
import { Mail, Github, Linkedin, Send, CheckCircle2, Copy, Check, Terminal, Clock, Globe, ArrowUpRight, AlertTriangle, ExternalLink } from 'lucide-react';
import { playClick, playChirp } from '../utils/sound';
import './Contact.css';

// Memoized LiveClock prevents root Contact re-rendering on 1-second intervals
const LiveClock = React.memo(function LiveClock() {
  const [time, setTime] = useState(() => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(new Date());
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Manila',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }).format(new Date())
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span>{time}</span>;
});

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'Full-Time Role',
    message: ''
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

  const contactEmail = 'dalepana405@gmail.com';

  const copyEmailToClipboard = () => {
    playChirp(840, 0.035);
    navigator.clipboard.writeText(contactEmail);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(25); } catch (_) {}
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const mailtoHref = `mailto:${contactEmail}?subject=${encodeURIComponent(
    `[Portfolio Transmission] ${formData.inquiryType} from ${formData.name || 'Visitor'}`
  )}&body=${encodeURIComponent(
    `Sender: ${formData.name || ''}\nEmail: ${formData.email || ''}\nClassification: ${formData.inquiryType}\n\nPayload:\n${formData.message || ''}`
  )}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    if (formData.message.trim().length < 10) {
      setSubmissionError('Transmission payload must contain at least 10 characters.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    const payload = {
      name: formData.name,
      email: formData.email,
      _subject: `[PORTFOLIO TRANSMISSION] ${formData.inquiryType} from ${formData.name}`,
      inquiryType: formData.inquiryType,
      message: formData.message,
      _captcha: 'false',
      _template: 'table'
    };

    try {
      const response = await fetch('https://formsubmit.co/ajax/dalepana405@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true)) {
        setSubmissionStatus({
          timestamp: new Date().toLocaleTimeString(),
          id: `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          status: 'DISPATCH_CONFIRMED',
          message: 'Transmission delivered directly to dalepana405@gmail.com. Florenz Dale will review and respond promptly.'
        });
        setFormData({
          name: '',
          email: '',
          inquiryType: 'Full-Time Role',
          message: ''
        });
      } else if (data.message && data.message.toLowerCase().includes('activate')) {
        setSubmissionStatus({
          timestamp: new Date().toLocaleTimeString(),
          id: `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          status: 'ACTIVATION_REQUIRED',
          message: "FormSubmit 1-Time Activation Required: An activation email was sent to dalepana405@gmail.com. Please open that email and click 'Activate Form' once to begin receiving all incoming messages directly in your inbox."
        });
      } else {
        throw new Error(data.message || 'Dispatch rejected by endpoint.');
      }
    } catch (err) {
      console.error('Contact transmission failed:', err);
      setSubmissionError(err.message || 'Network transmission failed. You can also transmit directly via your email client.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container contact-container">
        {/* Section Header Row */}
        <div className="contact-heading-row">
          <div className="bracket-container contact-header-badge font-mono">
            <div className="corner-bracket tl" />
            <div className="corner-bracket tr" />
            <div className="corner-bracket bl" />
            <div className="corner-bracket br" />
            <span className="badge-bullet">// 04</span>
            <span>COMMUNICATION CONDUIT</span>
          </div>
        </div>

        {/* Section Title Banner */}
        <div className="contact-title-banner">
          <h2 className="contact-display-title font-display">
            INITIATE CONTACT
          </h2>
          <p className="contact-subtitle font-mono">
            // NO ROBOCALLS, NO SPAM // STRICTLY HIGH-IMPACT ROLES &amp; SYSTEMS ARCHITECTURE
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="contact-grid">
          {/* Left Column: Direct Conduits & Telemetry */}
          <div className="contact-left-col">
            <div className="conduit-card glass-panel bracket-container">
              <div className="corner-bracket tl" />
              <div className="corner-bracket tr" />
              <div className="corner-bracket bl" />
              <div className="corner-bracket br" />

              <h3 className="conduit-heading font-display">DIRECT CONDUITS</h3>
              <p className="conduit-lead font-mono">
                Connect directly for engineering opportunities, technical advisory, or system architecture inquiries.
              </p>

              {/* Direct Email Action Box */}
              <div className="email-action-box font-mono">
                <div className="email-label-row">
                  <span className="label-text">PRIMARY INBOX:</span>
                  <span className="label-status text-green">ENCRYPTED / ACTIVE</span>
                </div>
                <div className="email-display-row">
                  <span className="email-text">{contactEmail}</span>
                  <button
                    type="button"
                    onClick={copyEmailToClipboard}
                    className="copy-btn font-mono"
                    aria-label="Copy email address"
                  >
                    {copiedEmail ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                    <span>{copiedEmail ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>

              {/* Telemetry Status Cards */}
              <div className="telemetry-info-grid font-mono">
                <div className="info-cell">
                  <Globe size={14} className="info-icon" />
                  <div className="info-content">
                    <span className="info-title">LOCATION:</span>
                    <span className="info-val">Zamboanga City, Philippines</span>
                  </div>
                </div>

                <div className="info-cell">
                  <Clock size={14} className="info-icon" />
                  <div className="info-content">
                    <span className="info-title">TIMEZONE:</span>
                    <span className="info-val">PHT (UTC+8) // <LiveClock /></span>
                  </div>
                </div>

                <div className="info-cell">
                  <Terminal size={14} className="info-icon" />
                  <div className="info-content">
                    <span className="info-title">AVAILABILITY:</span>
                    <span className="info-val text-green">Immediate / Q4 2026</span>
                  </div>
                </div>

                <div className="info-cell">
                  <CheckCircle2 size={14} className="info-icon" />
                  <div className="info-content">
                    <span className="info-title">ENGAGEMENT:</span>
                    <span className="info-val">Full-Time / Advisory</span>
                  </div>
                </div>
              </div>

              {/* Verified Social Channels */}
              <div className="social-links-block">
                <span className="social-block-title font-mono">// VERIFIED NETWORKS:</span>
                <div className="social-buttons-row">
                  <a
                    href="https://github.com/dalejwu"
                    target="_blank"
                    rel="noreferrer"
                    className="social-conduit-link font-mono"
                  >
                    <Github size={16} />
                    <span>GITHUB</span>
                    <ArrowUpRight size={14} className="link-arrow" />
                  </a>

                  <a
                    href="https://www.linkedin.com/in/dale-paña-3193a72a4/"
                    target="_blank"
                    rel="noreferrer"
                    className="social-conduit-link font-mono"
                  >
                    <Linkedin size={16} />
                    <span>LINKEDIN</span>
                    <ArrowUpRight size={14} className="link-arrow" />
                  </a>

                  <a
                    href="mailto:dalepana405@gmail.com"
                    className="social-conduit-link font-mono"
                  >
                    <Mail size={16} />
                    <span>EMAIL</span>
                    <ArrowUpRight size={14} className="link-arrow" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Dispatch Terminal */}
          <div className="contact-right-col">
            <div className="dispatch-terminal-card glass-panel bracket-container">
              <div className="corner-bracket tl" />
              <div className="corner-bracket tr" />
              <div className="corner-bracket bl" />
              <div className="corner-bracket br" />

              <div className="terminal-card-titlebar font-mono">
                <div className="titlebar-label">
                  <Terminal size={14} className="text-green" />
                  <span>DISPATCH_TERMINAL // SECURE TRANSMISSION</span>
                </div>
                <div className="titlebar-dots">
                  <span>●</span>
                  <span>●</span>
                </div>
              </div>

              {submissionStatus ? (
                <div className="submission-success-panel font-mono">
                  {submissionStatus.status === 'ACTIVATION_REQUIRED' ? (
                    <>
                      <div className="activation-badge">
                        <AlertTriangle size={24} className="text-amber" />
                        <span className="activation-title">1-TIME ACTIVATION REQUIRED</span>
                      </div>
                      <div className="activation-box">
                        <p className="activation-text">
                          {submissionStatus.message}
                        </p>
                      </div>
                      <div className="receipt-box">
                        <div className="receipt-line">
                          <span className="receipt-key">ROUTING TARGET:</span>
                          <span className="receipt-val text-amber">{contactEmail}</span>
                        </div>
                        <div className="receipt-line">
                          <span className="receipt-key">INSPECTION STEP:</span>
                          <span className="receipt-val text-green">Check Gmail inbox &gt; Click "Activate Form"</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="success-badge">
                        <CheckCircle2 size={24} className="text-green" />
                        <span className="success-title">TRANSMISSION ACKNOWLEDGED</span>
                      </div>
                      <div className="receipt-box">
                        <div className="receipt-line">
                          <span className="receipt-key">PACKET ID:</span>
                          <span className="receipt-val text-green">{submissionStatus.id}</span>
                        </div>
                        <div className="receipt-line">
                          <span className="receipt-key">TIMESTAMP:</span>
                          <span className="receipt-val">{submissionStatus.timestamp}</span>
                        </div>
                        <div className="receipt-line">
                          <span className="receipt-key">ROUTING STATUS:</span>
                          <span className="receipt-val text-green">DELIVERED (HTTP 200 OK)</span>
                        </div>
                        <div className="receipt-line">
                          <span className="receipt-key">RECIPIENT:</span>
                          <span className="receipt-val text-green">{contactEmail}</span>
                        </div>
                      </div>
                      <p className="success-message">
                        {submissionStatus.message}
                      </p>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setSubmissionStatus(null);
                      setSubmissionError(null);
                    }}
                    className="btn-cyber-outline reset-dispatch-btn"
                  >
                    TRANSMIT ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="dispatch-form">
                  {submissionError && (
                    <div className="dispatch-error-banner font-mono">
                      <div className="error-banner-header">
                        <AlertTriangle size={14} className="text-red" />
                        <span>DISPATCH NOTICE: {submissionError}</span>
                      </div>
                      <a
                        href={mailtoHref}
                        className="btn-cyber-solid mailto-fallback-btn"
                      >
                        TRANSMIT VIA EMAIL CLIENT (MAILTO)
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  )}

                  {/* Name Input */}
                  <div className="form-group font-mono">
                    <label htmlFor="sender-name" className="form-label">
                      [01] SENDER IDENTITY:
                    </label>
                    <input
                      id="sender-name"
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="cyber-input font-mono"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="form-group font-mono">
                    <label htmlFor="sender-email" className="form-label">
                      [02] RETURN ROUTE // EMAIL:
                    </label>
                    <input
                      id="sender-email"
                      type="email"
                      required
                      placeholder="e.g. alex@enterprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="cyber-input font-mono"
                    />
                  </div>

                  {/* Inquiry Type Select */}
                  <div className="form-group font-mono">
                    <label htmlFor="inquiry-type" className="form-label">
                      [03] INQUIRY CLASSIFICATION:
                    </label>
                    <select
                      id="inquiry-type"
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="cyber-select font-mono"
                    >
                      <option value="Full-Time Role">Full-Time Software Engineering Role</option>
                      <option value="Architecture Consulting">System Architecture Consulting</option>
                      <option value="Contract Project">High-Scale Contract Project</option>
                      <option value="Technical Collaboration">Technical Collaboration / Open Source</option>
                    </select>
                  </div>

                  {/* Message Payload */}
                  <div className="form-group font-mono">
                    <div className="form-label-row">
                      <label htmlFor="transmission-payload" className="form-label">
                        [04] TRANSMISSION PAYLOAD:
                      </label>
                      <span className={`char-counter ${formData.message.trim().length >= 10 ? 'valid' : ''}`}>
                        {formData.message.trim().length}/10 MIN CHARS
                      </span>
                    </div>
                    <textarea
                      id="transmission-payload"
                      required
                      minLength={10}
                      rows={5}
                      placeholder="Provide scope, tech requirements, or role details..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="cyber-textarea font-mono"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-cyber-solid submit-btn"
                  >
                    {isSubmitting ? (
                      <span>ENCRYPTING &amp; DISPATCHING...</span>
                    ) : (
                      <>
                        <span>TRANSMIT INQUIRY</span>
                        <Send size={16} />
                      </>
                    )}
                  </button>

                  {/* Mailto Direct Link Fallback */}
                  <div className="form-fallback-row font-mono">
                    <a href={mailtoHref} className="fallback-mailto-link">
                      PREFER LOCAL EMAIL CLIENT? TRANSMIT DIRECTLY &gt;
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
