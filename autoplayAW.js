const delay = millis => new Promise((resolve, reject) => {
  setTimeout(_ => resolve(), millis)
});

const userAccount = await wax.login();
account = userAccount;
unityInstance.SendMessage('Controller', 'Server_Response_LoginData', userAccount);
await delay(20000);
while(true){
var firstMine = true;
var previousMineDone = false;
var minedelay = 1;
do {
    minedelay = await getMineDelay(account);
    await delay(minedelay);
  } while (minedelay !== 0 && (previousMineDone || firstMine))
console.log('just mine it!');

var balance = await getBalance(account, wax.api.rpc);
console.log('balance: (before mine)'+balance);

await background_mine(account).then((mine_work)=>{
            unityInstance.SendMessage('Controller', 'Server_Response_Mine', JSON.stringify(mine_work));
       console.log(`${mine_work.account} Pushing mine results...`);
        const mine_data = {
            miner: mine_work.account,
            nonce: mine_work.rand_str,
        };
        console.log('mine_data', mine_data);
        const actions = [{
            account: mining_account,
            name: 'mine',
            authorization: [{
                actor: mine_work.account,
                permission: 'active',
            }, ],
            data: mine_data,
        }, ];
        wax.api.transact({
            actions,
        }, {
            blocksBehind: 3,
            expireSeconds: 90,
        }).then((result)=>{
            console.log('result is=', result);
            var amounts = new Map();
            if (result && result.processed) {
                result.processed.action_traces[0].inline_traces.forEach((t)=>{
                    if (t.act.data.quantity) {
                        const mine_amount = t.act.data.quantity;
                        console.log(`${mine_work.account} Mined ${mine_amount}`);
                        if (amounts.has(t.act.data.to)) {
                            var obStr = amounts.get(t.act.data.to);
                            obStr = obStr.substring(0, obStr.length - 4);
                            var nbStr = t.act.data.quantity;
                            nbStr = nbStr.substring(0, nbStr.length - 4);
                            var balance = (parseFloat(obStr) + parseFloat(nbStr)).toFixed(4);
                            amounts.set(t.act.data.to, balance.toString() + ' TLM');
 
                        } else {
                            amounts.set(t.act.data.to, t.act.data.quantity);
                        }
                    }
                }
                );
                unityInstance.SendMessage('Controller', 'Server_Response_Claim', amounts.get(mine_work.account));
                firstMine = false;
                previousMineDone = true;
            }
        }
        ).catch((err)=>{
            unityInstance.SendMessage('ErrorHandler', 'Server_Response_SetErrorData', err.message);
            previousMineDone = false;
        }
        );
        }
        );

var balance = await getBalance(account, wax.api.rpc);
console.log('balance (after mined): '+balance);
}