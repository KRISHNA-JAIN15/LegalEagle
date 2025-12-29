import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileSearch,
  MessageSquare,
  Shield,
  Zap,
  ArrowRight,
  Scale,
  Building,
  Users,
  Briefcase,
} from "lucide-react";
import "./Features.css";

const Features = () => {
  const [activeUseCase, setActiveUseCase] = useState(0);

  const mainFeatures = [
    {
      icon: <FileSearch size={28} />,
      title: "Document Analysis Engine",
      description:
        "Upload contracts, agreements, or any legal document. Our AI extracts key clauses, identifies risks, and provides comprehensive summaries in seconds.",
      link: "/features#analysis",
      visual: "primary",
    },
    {
      icon: <MessageSquare size={28} />,
      title: "Intelligent Q&A",
      description:
        "Ask questions in plain English about your documents. Get accurate, context-aware answers backed by specific citations from your uploaded files.",
      link: "/features#qa",
      visual: "illustration",
    },
    {
      icon: <Shield size={28} />,
      title: "Compliance Checker",
      description:
        "Automatically verify documents against regulatory requirements. Stay compliant with real-time alerts and detailed compliance reports.",
      link: "/features#compliance",
      visual: "primary",
    },
  ];

  const useCases = [
    {
      icon: <Scale size={24} />,
      title: "Law Firms",
      shortDesc: "Streamline contract review",
      description:
        "Accelerate contract review, due diligence, and legal research. Give your team more time to focus on high-value strategic work.",
    },
    {
      icon: <Building size={24} />,
      title: "Enterprises",
      shortDesc: "Manage legal risk at scale",
    },
    {
      icon: <Users size={24} />,
      title: "Legal Teams",
      shortDesc: "Collaborate efficiently",
    },
    {
      icon: <Briefcase size={24} />,
      title: "Consultants",
      shortDesc: "Deliver faster insights",
    },
  ];

  const useCaseDetails = [
    {
      description:
        "Accelerate contract review, due diligence, and legal research. Give your team more time to focus on high-value strategic work with AI-powered document analysis.",
      projects: ["Baker McKenzie", "Latham & Watkins", "DLA Piper"],
    },
    {
      description:
        "Manage thousands of contracts across departments. Identify risks, ensure compliance, and maintain visibility over your entire legal portfolio.",
      projects: ["Microsoft", "Google", "Amazon"],
    },
    {
      description:
        "Enable seamless collaboration between legal and business teams. Share insights, track changes, and maintain version control with ease.",
      projects: ["Stripe Legal", "Coinbase", "Shopify"],
    },
    {
      description:
        "Deliver comprehensive legal analysis to clients faster than ever. Stand out with AI-enhanced insights and detailed reports.",
      projects: ["Deloitte Legal", "PwC", "EY Law"],
    },
  ];

  return (
    <>
      <section className="features dotted-bg">
        <div className="container">
          <div className="features-header">
            <h2 className="features-title">
              More Is More.
              <br />
              Go Horizontal.
            </h2>
            <p className="features-subtitle">
              Powerful features that transform how you work with legal documents
            </p>
          </div>

          {mainFeatures.map((feature, index) => (
            <div key={index} className="feature-row">
              <div className="feature-content">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link to={feature.link} className="feature-link">
                  Learn More <ArrowRight size={18} />
                </Link>
              </div>
              <div
                className={`feature-visual feature-visual-${feature.visual}`}
              ></div>
            </div>
          ))}
        </div>
      </section>

      <section className="use-cases dotted-bg">
        <div className="container">
          <div className="use-cases-header">
            <h2 className="use-cases-title">
              Bringing Legal
              <br />
              Intelligence Everywhere
            </h2>
          </div>

          <div className="use-cases-grid">
            <div className="use-case-list">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className={`use-case-item ${
                    activeUseCase === index ? "active" : ""
                  }`}
                  onClick={() => setActiveUseCase(index)}
                >
                  <div className="use-case-icon">{useCase.icon}</div>
                  <h4>{useCase.title}</h4>
                  <p>{useCase.shortDesc}</p>
                </div>
              ))}
            </div>

            <div className="use-case-detail">
              <p>{useCaseDetails[activeUseCase].description}</p>
              <div className="use-case-projects">
                <span>Trusted by leading organizations</span>
                <div className="project-logos">
                  {useCaseDetails[activeUseCase].projects.map(
                    (project, idx) => (
                      <span key={idx} className="project-logo">
                        {project}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
