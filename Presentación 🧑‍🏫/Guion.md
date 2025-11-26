Project Script: PeerHive – The Evolution of an Idea
***
## I. The Master Plan: A Nose for Business (The Initial Idea)
As good software engineers (and let’s be honest, we chase the money), our first instinct when approaching a project was: “Where’s the commission?”
We thought big. The core idea was solid: create a platform for peer-to-peer tutoring (asesorías de alumnos para alumnos). But initially, the financial incentive was the engine. 

### A). The Reality Check: The Functional Problem
But the real world hit us. Before counting our millions, we had to solve real-life problems that affected us directly or indirectly, just to make the project, ahem, practical and functional:

* **The Scheduling Problem (The Gordian Knot):** We found that lack of schedule coordination was the number one conflict. 
* **The Solution (The Value Proposition):** This is where our practical genius shone. The perfect value proposition was the schedule "match" between tutor and student. Need help at midnight or on a Sunday morning? Done! The platform had to link them up to receive timely help during their only available hours: night, early morning, or weekends.

### B). The Big Pivot: Goodbye Commission, Hello Elective Credits (The "End Point")
Once the availability problem was solved, we hit the second major barrier: How do we pay the tutors?
So, after talking with the professor and the coordinator we found the ideal path: academic value. We concluded that giving tutors **creditos optativos** for their dedicated time would be the best and most functional way to pay them

***
## II. The First Assault: Defining the Terrain and the Treasure (First Deliverable)
Once we landed on the idea that **creditos optativos** were the new currency, we had to formalize our vision. The First Deliverable was all about strategy, scope, and tackling the problem head-on.

### A. The Declaration of War (The Problem)
We didn't just say people needed help; we diagnosed the root of the issue with engineering precision:

* **The Schedule Wall:** Early-semester Software Engineering students need academic support but often can't attend in-person tutoring due to schedule clashes, work, or long commute times.
* **The Tutor's Paradox:** Advanced students need elective credits but can't commit to fixed tutoring schedules for the exact same reasons.

### B. PeerHive 🐝: The Solution that Earns Credits (And Avoids Traffic)
Our solution, PeerHive, is a flexible tutoring platform that becomes the perfect academic matchmaker:

| Role | Action |
| :--- | :--- |
| Learner (1st - 4th semester) | Posts their question and, most importantly, their time availability. |
| Tutor (+180 credits) | Offers their knowledge by posting their free hours to earn credits. |
| The Platform | Creates the perfect match, establishing a mutual support system where everyone wins. |

### C. Innovation Factor: Flexibility, Our New Obsession!
* **Matching Schedules:** Our key differentiator. Unlike traditional systems, we focus on matching students’ real and non-conventional schedules.
* **Answering a Real Need:** We're not solving imaginary problems; we are attacking the issues of work, travel, and lack of time identified by our own community.

### D. Technical Foundation Work
In this first deliverable, the entire manifesto was backed up with a formal structure:
* We created our GitHub Repository to house all documentation.
* We defined our Primary Users (Learners and Tutors) and Secondary Users (Coordination and Administration).
* We created the first version of the Functional and Non-Functional Requirements Table to know exactly what we were going to build, setting the stage for the next Mock-Up.

***
## III. The Transition: From Manifesto to Functional Prototype (Second Deliverable)
If the First Deliverable was the diagnosis and the promise, this Second Deliverable marks our transition to execution and tangible design.

### A. The First Filter: Meeting with the Coordinator and a New Direction
Before starting development, we had a key meeting with the coordinator. This meeting not only validated the **creditos optativos** concept but helped us delimit several things and set clear boundaries for the project.
* **Validation of Limits:** By defining operational limits with the coordination, we could restrict the initial scope to specific courses within the degree.
* **Vision Alignment:** This meeting ensured our vision was perfectly aligned with the faculty's needs and processes.

### B. Structure and Rigor: From Idea to the Scrum Machine
With clear guidelines, we adopted a rigorous and proven working methodology:
* **Defined Process:** We established a clear **Scrum** process, a traceable workflow on GitHub (moving from TO DO to DONE), and a **"Definition of Done" (DoD)** to ensure quality.
* **Formal Documentation:** We generated all formal documentation: Requirements Tables, **MoSCoW** Prioritization, and User Stories. This work culminated in the functional mock-up.

### C. The Big Quality Pivot: Who Should Be a Tutor?
But during Sprint 2, we realized a crucial detail: schedule flexibility was useless if the help lacked quality.
We asked a question that changed everything: Who should be a tutor? Is having free time enough?

> NARRATOR (on camera, firm tone):
> And here, our goal evolved. We decided PeerHive wouldn't just be a "tutoring" website, but a system for **reliable tutoring**.

To guarantee quality:
* **Minimum Requirement:** A tutor must be in 5th semester or higher.
* **Academic Credentialing:** Not only that. They must have sufficient credits and an academic history that proves they are in good standing.
* **Verification Mechanism:** We will verify this by requesting their official **Kardex** (transcript) from the faculty.

This transformed our Authentication and Roles requirement into a Quality Filter.

***
## IV. Consolidation and Testing: Refinement and Validation (Third Deliverable)
The Third Deliverable (Sprint 3) was the phase where we moved past planning and focused on real user experience.

### A. Final Refinement and Design Execution
* **Redefinition of User Stories:** We took the feedback and the lessons learned to refine the User Stories. We focused on a minimal, perfect, and functional set of stories that served as the blueprint for the final Mock-Up.
* **The Launch Mock-Up:** We built the most realistic and final version of the interface. This Mock-Up represents the culmination of all strategic decisions.

### B. The Security Pivot: From Buttons to Recordings
In this testing phase, we discovered a critical weakness in our "Engineer's Lock":

> (0:50 - 1:05) NARRATOR (concerned but resolute tone):
> We realized the Check-In and Check-Out buttons weren't secure enough. They only validated time, but didn't offer a robust way to verify that tutors were actually giving advice. They could check in and check out without talking to anyone.

So, the idea of using a robust, readily available tool emerged: **Microsoft Teams**. The new requirement is for the tutor to **record the session**, so the system can transcribe the content, and the file is automatically saved to a private Teams channel. This verifies both the duration and the content, guaranteeing documentary proof of the service provided.

### C. Usability Testing and Final Conclusion
* **Critical Flow Testing:** We observed users attempting registration and, crucially, using the new Teams validation flow.
* **Issue Logging:** We meticulously documented the problems and friction points that arose. This is pure gold that allows us to correct the path immediately or add it to the future roadmap.

***
## V. Final Wrap-Up: The Final Destination
We have reached the end of our journey, and what you have before you is more than a project; it is proof of how adaptation, quality, and strategy can solve a complex problem.

### Summary of the Journey
Our story began with the ambition to earn a commission, a dream that quickly crashed into the student's logistical and economic reality. The pivot to elective credits, validated by the coordinator, gave us direction. Finally, the need to guarantee quality led us to implement the Kardex verification filter and the secure Teams recording system, transforming PeerHive into a system for reliable, not just flexible, tutoring.

### The Final Product
PeerHive is the result of this evolutionary process:
* **Maximum Flexibility:** Connection based on the "match" of non-conventional schedules.
* **Guaranteed Quality:** Tutors validated by their academic history (Kardex), ensuring the shared knowledge is high-level.
* **Academic Sustainability:** An ecosystem driven by elective credits, creating a mutual support cycle that benefits the entire community.

The final Mock-Up we present today has been tested and validated. We are ready to move PeerHive to the implementation phase and prove that software engineers, even if they dream of commissions, end up building solutions of real value.