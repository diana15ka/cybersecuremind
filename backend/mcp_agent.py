from crewai import Agent, Task, Crew
from serp_api import search_domain
from unlocker_api import unlock_website

def investigate_threat(target_url):

    # Step 1 — Search web reputation
    serp_results = search_domain(target_url)

    # Step 2 — Open suspicious website
    unlocked_data = unlock_website(target_url)

    # AI Fraud Agent
    fraud_agent = Agent(
        role="Fraud Hunter Agent",

        goal=(
            "Investigate phishing websites, "
            "financial scams, impersonation attacks, "
            "and cybercrime threats."
        ),

        backstory=(
            "An elite AI cyber investigator using "
            "Bright Data live web intelligence."
        ),

        verbose=True
    )

    # AI Compliance Agent
    compliance_agent = Agent(
        role="Compliance Agent",

        goal=(
            "Detect compliance risks, vendor threats, "
            "financial violations, and regulatory concerns."
        ),

        backstory=(
            "An enterprise AI compliance investigator."
        ),

        verbose=True
    )

    # Task 1
    fraud_task = Task(
        description=f"""
        Investigate this suspicious target:

        URL:
        {target_url}

        SERP Results:
        {serp_results}

        Website HTML:
        {unlocked_data}
        """,

        agent=fraud_agent
    )

    # Task 2
    compliance_task = Task(
        description=f"""
        Analyze compliance and financial risks
        related to:

        {target_url}
        """,

        agent=compliance_agent
    )

    # Crew
    crew = Crew(
        agents=[fraud_agent, compliance_agent],
        tasks=[fraud_task, compliance_task],
        verbose=True
    )

    result = crew.kickoff()

    return str(result)