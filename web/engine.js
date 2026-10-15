(function(g){'use strict';const U=typeof module!=='undefined'?require('./runtime.js'):g.LabUtil;
const departments={sales:['all-staff','sales-read'],finance:['all-staff','finance-read'],engineering:['all-staff','engineering-read']};
const initial={event:'transfer',employee:'alice',department:'finance',approver:'manager',privileged:false,employees:[{id:'alice',department:'sales',active:true,groups:['all-staff','sales-read','legacy-admin'],sessions:['session-1']},{id:'bob',department:'finance',active:true,groups:['all-staff','finance-read'],sessions:['session-2']}]};
function run(input){const x=U.clone(U.obj(input));U.one(x.event,['join','transfer','offboard','reconcile'],'lifecycle event');U.text(x.employee,'Employee',80);U.list(x.employees,'Employees',100);U.unique(x.employees,'Employee');const before=U.clone(x.employees);let e=x.employees.find(v=>v.id===x.employee);const actions=[],audit=[];
if(x.event==='join'){U.check(!e,'Employee already exists.');e={id:x.employee,department:U.one(x.department,Object.keys(departments),'department'),active:true,groups:[],sessions:[]};x.employees.push(e);actions.push({operation:'create',resource:e.id,value:'active account'});}
else U.check(e,'Employee not found.');
U.list(e.groups,'Groups',30);U.list(e.sessions,'Sessions',30);
if(x.event==='transfer'){U.check(e.active,'Cannot transfer an inactive employee.');const department=U.one(x.department,Object.keys(departments),'department');if(e.department!==department)actions.push({operation:'update-department',resource:e.id,value:department});e.department=department;}
if(x.event==='offboard')e.active=false;
const desired=e.active?[...departments[U.one(e.department,Object.keys(departments),'department')]]:[];
if(x.privileged&&e.active){if(x.approver==='manager'){desired.push('privileged-reviewer');audit.push('Independent manager approval recorded for this plan.');}else audit.push('Privileged assignment denied: independent manager approval required.');}
for(const group of e.groups)if(!desired.includes(group))actions.push({operation:'remove',resource:e.id,value:group});
for(const group of desired)if(!e.groups.includes(group))actions.push({operation:'add',resource:e.id,value:group});
e.groups=desired;
if(['transfer','offboard'].includes(x.event)||!e.active){for(const id of e.sessions)actions.push({operation:'revoke-session',resource:e.id,value:id});e.sessions=[];}
if(x.event==='offboard')actions.push({operation:'disable',resource:e.id,value:'active=false'});
audit.push('Desired access derived from employee status and department.','Plan is synthetic; no external identity provider was changed.');
return {title:'Lifecycle reconciliation complete',summary:actions.length+' changes in the proposed plan',metrics:{changes:actions.length,remainingSessions:e.sessions.length,remainingGroups:e.groups.length},rows:actions,employees:x.employees,before,trace:audit,report:{event:x.event,employee:x.employee,actions,after:e}};}
const E={initial,run,departments};if(typeof module!=='undefined')module.exports=E;else g.LabEngine=E;
})(globalThis);
