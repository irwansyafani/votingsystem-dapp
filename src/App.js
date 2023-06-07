import "./App.css";
import {
  getCandidate,
  getTotalVotersOf,
  postVoteCandidate,
} from "./util/contract";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./util/connector";
import { truncate } from "./util/helpers";

function App() {
  const { active, account, activate, library } = useWeb3React();
  const [candidates, setCandidates] = useState([]);
  const [score, setScore] = useState({});

  const connectWallet = async () => {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  };

  const doVote = (address) => {
    const signer = library["getSigner"](account);
    postVoteCandidate(address, signer)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getCandidate(0).then((candidate1) => {
      getCandidate(1).then((candidate2) => {
        setCandidates([candidate1, candidate2]);
      });
    });
  }, []);

  useEffect(() => {
    if (candidates.length) {
      candidates.forEach((address) => {
        getTotalVotersOf(address).then((total) => {
          const exist = { ...score };
          exist[address] = +total || 0;
          setScore(exist);
        });
      });
    }
  }, [candidates]);

  return (
    <div className="App">
      {/* <h1>Voting System DApp</h1> */}
      {active ? (
        <p>{account}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      {/* <h2>Candidates</h2> */}
      {candidates.map((address, i) => {
        return (
          <div key={i}>
            <p>Voters: {score[address] || 0}</p>
            <button onClick={active ? () => doVote(address) : connectWallet}>
              Candidate {i + 1}: {truncate(address)}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
