const pollForm = document.getElementById("radioForm");
const resultsDiv = document.getElementById('results');
const resetButton = document.getElementById('reset');

import { testing_trial_1_backend } from "../../declarations/testing_trial_1_backend";


// Local Data 
const pollResults = {
  "Rust": 0,
  "Motoko": 0,
  "TypeScript": 0,
  "Python": 0
};

document.addEventListener('DOMContentLoaded', async (e) => {
  e.preventDefault();

  console.log("Fetching question from Motoko backend...."); 
  console.log("Poll backend is: ", testing_trial_1_backend); 
  const question = await testing_trial_1_backend.getQuestion();
  console.log("Question is: ", question); 

  document.getElementById("question").innerText = question;

  const voteCounts = await testing_trial_1_backend.getVotes();
  updateLocalVoteCounts(voteCounts);
  displayResults();
  return false;
}, false);

pollForm.addEventListener('submit', async (e) => { 
  e.preventDefault(); 

  const formData = new FormData(pollForm);
  const checkedValue = formData.get("option");

  const updatedVoteCounts = await testing_trial_1_backend.vote(checkedValue);
  console.log("Returning from await...")
  console.log(updatedVoteCounts);
  updateLocalVoteCounts(updatedVoteCounts);
  displayResults();
  return false;
}, false); 

resetButton.addEventListener('click', async (e) => { 
  e.preventDefault();
    
  await testing_trial_1_backend.resetVotes();
  const voteCounts = await testing_trial_1_backend.getVotes();
  updateLocalVoteCounts(voteCounts);

  displayResults();
  return false;
}, false); 

function displayResults() {
  let resultHTML = '<ul>';
  for (let key in pollResults) {
      resultHTML += '<li><strong>' + key + '</strong>: ' + pollResults[key] + '</li>';
  }
  resultHTML += '</ul>';
  resultsDiv.innerHTML = resultHTML;
};

function updateLocalVoteCounts(arrayOfVoteArrays){ 
  for (let voteArray of arrayOfVoteArrays) {
    let voteOption = voteArray[0];
    let voteCount = voteArray[1];
    pollResults[voteOption] = voteCount;
  }
}
