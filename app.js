/*
s.countedForCredits = true;
}
DB.saveSessions(sessions);
alert('Sesión confirmada (demo).');
showSessions(user);
}


// Advisor confirms (would be triggered automatically when they finish in some flows)
function advisorConfirm(sessionId){
const sessions = DB.getSessions();
const s = sessions.find(x=>x.id===sessionId);
s.confirmedByAdvisor = true;
s.log.push({event:'confirmed-by-advisor','at':new Date().toISOString()});
if(s.confirmedByAdvisor && s.confirmedByRequester) s.countedForCredits = true;
DB.saveSessions(sessions);
}


// --- Report generation (CSV export demo) ---
function generateReport(user){
// Only advisors should generate report
const sessions = DB.getSessions().filter(s=>s.advisorId===user.id && s.countedForCredits);
const rows = [['matricula','sessionId','startTime','endTime','durationMinutes']];
rows.push(...sessions.map(s=>[user.matricula,s.id,s.startTime,s.endTime,s.durationMinutes]));
const csv = rows.map(r=>r.map(v=>`"${(v||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n');
const blob = new Blob([csv], {type:'text/csv'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a'); a.href=url; a.download = `peerhive_report_${user.matricula}.csv`; a.click(); URL.revokeObjectURL(url);
}


// --- Helpers ---
function cryptoRandomId(){ return Math.random().toString(36).slice(2,10) }


// --- Demo seeding helpers (optional) ---
(function seedDemo(){
if(!localStorage.getItem('peerhive_seeded')){
DB.saveUsers([]); DB.saveRequests([]); DB.saveSessions([]);
localStorage.setItem('peerhive_seeded','1');
}
})();


// initialize UI
init();


/*
Notes for production (server-side responsibilities):
1. Authentication: Implement server endpoints for register/login. Hash passwords with Argon2 or bcrypt. Implement email verification and rate-limiting.
2. Email: Use institutional SMTP or API and verify that the provided matricula belongs to the student (university API) if available.
3. Database: Use SQL schema provided in db/schema.sql. Implement transactional writes for check-in/check-out and audit logging.
4. Files: Store attachments on object storage (e.g. S3) with signed URLs and virus scanning.
5. Real-time: Use WebSocket/PubSub for chat (Socket.IO, Pusher, or SFU) with TLS. Implement message encryption-in-transit.
6. Calendar sync: Implement OAuth2 for Google and Microsoft to create events on users' calendars.
7. Backups: Configure daily DB backups and a restore plan (24h RTO requirement).
8. Security: Parameterized queries, input sanitation, CSRF tokens, CSP, and automated security scans.
*/