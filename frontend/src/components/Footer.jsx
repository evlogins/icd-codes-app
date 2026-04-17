export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <span>ICD-10-CM FY 2026</span>
        <span className="footer-sep">·</span>
        <span>Effective October 1, 2025</span>
        <span className="footer-sep">·</span>
        <span>Source: <a href="https://www.cms.gov/Medicare/Coding/ICD10" target="_blank" rel="noopener noreferrer">CMS</a> / <a href="https://clinicaltables.nlm.nih.gov/" target="_blank" rel="noopener noreferrer">NLM</a></span>
        <span className="footer-sep">·</span>
        <span>Informational use only. Not medical advice.</span>
      </div>
    </footer>
  );
}
