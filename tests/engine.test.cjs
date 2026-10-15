'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../web/engine.js');
const copy=()=>structuredClone(E.initial);

test('Transfer removes obsolete grants and revokes sessions',()=>{const r=E.run(copy());const a=r.employees.find(e=>e.id==='alice');assert.deepEqual(a.groups,['all-staff','finance-read']);assert.deepEqual(a.sessions,[]);assert.equal(a.department,'finance');});
test('Offboarding removes every grant and session',()=>{const x=copy();x.event='offboard';const a=E.run(x).employees[0];assert.equal(a.active,false);assert.deepEqual(a.groups,[]);assert.deepEqual(a.sessions,[]);});
test('Join is idempotency guarded and requires a new identity',()=>{const x=copy();x.event='join';assert.throws(()=>E.run(x),/already exists/);x.employee='carol';assert.equal(E.run(x).employees.length,3);});
test('Privileged grants need independent manager perspective',()=>{const x=copy();x.privileged=true;x.approver='employee';assert.ok(!E.run(x).employees[0].groups.includes('privileged-reviewer'));x.approver='manager';assert.ok(E.run(x).employees[0].groups.includes('privileged-reviewer'));});
test('Inactive transfer and unknown departments are rejected',()=>{const x=copy();x.employees[0].active=false;assert.throws(()=>E.run(x),/inactive/);x.employees[0].active=true;x.department='unknown';assert.throws(()=>E.run(x),/department/);});
test('Analysis does not mutate the caller directory',()=>{const x=copy(),before=JSON.stringify(x);E.run(x);assert.equal(JSON.stringify(x),before);});
