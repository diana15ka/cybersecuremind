"use client";

export default function IntelligenceCard({
  title,
  severity,
  confidence,
  data,
  type,
}: any) {

  const riskScore =
    data?.risk_score ??
    Math.round(
      (
        (data?.fraud_score || 0) +
        (data?.confidence || 0) +
        (data?.browser_risk || 0)
      ) / 3
    );

  const estimatedExposure =
    data?.potential_loss_range ||
    (
      riskScore >= 80
        ? "$250,000 - $1,000,000+"
        : riskScore >= 60
        ? "$50,000 - $250,000"
        : riskScore >= 40
        ? "$10,000 - $50,000"
        : riskScore >= 20
        ? "$5,000 - $10,000"
        : "$0 - $5,000"
    );

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 min-h-[360px]">
      <h3 className="text-white font-bold text-lg mb-4">
        {title}
      </h3>

      <div className="text-xs text-zinc-500 uppercase tracking-widest mb-5">
        AI-generated intelligence module
      </div>

      {type === "finance" && (
        <div className="space-y-4 text-sm text-zinc-300">
          <div>
            <div className="text-zinc-500 uppercase text-xs mb-1">
              Financial Exposure
            </div>
            {data?.financial_exposure ||
              "Possible financial fraud exposure detected."}
          </div>

          <div>
            <div className="text-zinc-500 uppercase text-xs mb-1">
              Targeted Assets
            </div>

            <ul className="list-disc ml-5">
              {(data?.targeted_assets || [
                "crypto wallets",
                "banking credentials",
                "payment cards",
              ]).map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-zinc-500 uppercase text-xs mb-1">
              Fraud Vectors
            </div>

            <ul className="list-disc ml-5">
              {(data?.fraud_vectors || [
                "credential harvesting",
                "wallet theft",
                "account takeover",
              ]).map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="text-yellow-400">
            Estimated Exposure: {estimatedExposure}
          </div>

          <div className="text-red-400">
            Financial Impact: {data?.financial_impact || "elevated"}
          </div>

          <div>
            <div className="text-zinc-500 uppercase text-xs mb-1">
              Recommended Action
            </div>

            {data?.recommended_financial_action ||
              "Avoid entering payment data, OTP codes, private keys, or wallet seed phrases."}
          </div>
        </div>
      )}

      {type === "market" && (
        <div className="space-y-4 text-sm text-zinc-300">
          <div>
            <div className="text-zinc-500 uppercase text-xs mb-1">
              Target Audience
            </div>

            <ul className="list-disc ml-5">
              {data?.target_audience?.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-zinc-500 uppercase text-xs mb-1">
              GTM Patterns
            </div>

            <ul className="list-disc ml-5">
              {data?.gtm_patterns?.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="text-red-400">
            Brand Risk: {data?.brand_impersonation_risk || "Unknown"}
          </div>

          <div className="text-yellow-400">
            Compliance Signal: {data?.compliance_signal || "Unknown"}
          </div>
        </div>
      )}
    </div>
  );
}