const assert = require('node:assert/strict');
const {randomUUID} = require('node:crypto');
const Stats = require('../app/game/statistics.js').GameStats;

module.exports = async function checkRetirement(base, instanceId) {
    const api=async(route,token,body,method=body?'PUT':'GET')=>{
        const r=await fetch(base+route,{method,headers:{'X-Dev-Instance':instanceId,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined});
        return {status:r.status,data:r.status===204?null:await r.json()};
    };
    const registration=await api('/api/auth/register',null,{nickname:'Retire-'+randomUUID(),password:'retirement-test'},'POST');
    assert.equal(registration.status,201);
    const token=registration.data.authToken;
    const activation=await api('/api/game/session',token,{operationId:randomUUID(),expectedVersionGuid:null,confirmTransfer:false,source:'local'});
    const achievements=Object.fromEntries(Stats.achievements.map(id=>[id,['survivor','unsinkable'].includes(id)?1:0]));
    const state={gameId:randomUUID(),day:50,money:2000001,health:10,wife:40,threat:40,rating:40,mode:'arcade',difficulty:'normal',
        cooldowns:{police_bribe:0,wife_spa:0,assuta_vip:0,pr_agency:0},achievements,isFinished:true,endReason:'honorable_retirement',finishedAt:Date.now()};
    const stats=Stats.update({},state,true);
    const body={gameSessionId:activation.data.gameSessionId,writeTimestamp:100,state,stats};
    for(let i=0;i<2;i++)assert.equal((await api('/api/game/save',token,body)).status,204);
    const saved=await api('/api/game/save',token);
    assert.deepEqual(saved.data.state,state);assert.deepEqual(saved.data.stats,stats);
    const old=structuredClone(body);old.writeTimestamp=101;
    for(const id of ['unsinkable']){delete old.state.achievements[id];delete old.stats.achievements[id];for(const row of Object.values(old.stats.byMode))delete row.achievements[id];}
    assert.equal((await api('/api/game/save',token,old)).status,409,'an old tab cannot erase the new achievement counters');
    assert.deepEqual((await api('/api/game/save',token)).data,saved.data);
    const sql=await fetch('http://127.0.0.1:8082/v2/pipeline',{method:'POST',body:JSON.stringify({requests:[{type:'execute',stmt:{sql:'SELECT days,money,end_reason,achievements_json FROM game_history WHERE account_id=?',args:[{type:'text',value:registration.data.account.id}],want_rows:true}},{type:'close'}]})});
    const rows=(await sql.json()).results[0].response.result.rows;
    assert.equal(rows.length,1);assert.equal(Number(rows[0][1].value),2000001);assert.equal(rows[0][2].value,'honorable_retirement');
    assert.equal(JSON.parse(rows[0][3].value).unsinkable,1);
};
