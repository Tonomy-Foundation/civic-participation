import React, { useEffect } from 'react';
import Civic from '../../services/Civic';
import { ProposalCategory, ProposalType, ProposalStatus } from '../../types/civic';

function Home() {

    useEffect(() => {
        async function main() {
            let civic = new Civic(); // put this in context API, or use singleton

            let accountLoginRes;
            try {
                accountLoginRes = await civic.accountLogin('jack', 'Password1234!');
                console.log('accountLogin() - jack 1', accountLoginRes);
            } catch (e) {
                const accountCreateRes = await civic.accountCreate('jack', 'Password1234!', 'Jack Tanner');
                console.log('accountCreate()', accountCreateRes);
            }

            const proposal = {
                title: 'Build a flowerbed next to John\'s tacos',
                description: description,
                category: ProposalCategory.Green,
                budget: 0,
                type: ProposalType.Create,
                photos: [],
                location: createLocation()
            }
            

            const proposalData = await civic.proposalCreate(proposal);
            console.log('proposalCreate()', proposalData)
            const proposalId = proposalData.proposalId;

            accountLoginRes = await civic.accountLogin('tijn', 'Password123');
            console.log('accountLogin() - tijn', accountLoginRes);
            proposal.proposalId = proposalId;
            proposal.status = ProposalStatus.Reviewing;
            let proposalUpdateRes = await civic.proposalUpdate(proposal);
            console.log('proposalUpdate()', proposalUpdateRes);

            proposal.regulation = 'RM 3212';
            proposal.budget = 2300.00;
            proposal.comment = 'Regulations checked and budget added'
            proposal.status = ProposalStatus.Approved;
            proposalUpdateRes = await civic.proposalUpdate(proposal);
            console.log('proposalUpdate()', proposalUpdateRes);

            accountLoginRes = await civic.accountLogin('jack', 'Password1234!');
            console.log('accountLogin() - jack 2', accountLoginRes);
            const proposalVoteRes = await civic.proposalVote(proposalId, true);
            console.log('proposalVote', proposalVoteRes);

            let proposals = await civic.proposalList();
            console.log('proposalList()', proposals);
            proposals = await civic.proposalList(ProposalStatus.Approved);
            console.log('proposalList(Approved)', proposals);

            const proposalDetails = await civic.proposalGet(proposalId);
            console.log('proposalGet()', proposalDetails);
            const proposalHistory = await civic.proposalHistory(proposalId);
            console.log('proposalHistory()', proposalHistory);
        }

        main();
    })
    return (
        <div>
            Here is the app!
        </div>
    )
}

function createLocation() {
    const lng = 52.1117363 + Math.random() * 0.01;
    const lat = 4.282188 + Math.random() * 0.01;
    return `${lng},${lat}`;
}

// const description = 'Lorem ipsum dolor sit amet';
const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis imperdiet consectetur convallis. Fusce elementum urna at velit venenatis malesuada a eu libero. Fusce sed nisl tempus, ultrices quam sit amet, ultrices nulla. Fusce vulputate vestibulum lacinia. Phasellus ultrices justo dolor, sit amet tempus nisl semper feugiat. Suspendisse imperdiet nec urna sed pulvinar. Sed sit amet leo sollicitudin, blandit massa at, lacinia quam. Aenean dapibus euismod tortor, id pharetra libero. Sed tempus vulputate ullamcorper. Curabitur porttitor, ex eget lobortis venenatis, metus sapien scelerisque metus, sed laoreet lacus odio non turpis. Donec hendrerit efficitur ornare. Pellentesque molestie neque elit, vitae porttitor tellus posuere non. Nulla lobortis, turpis non suscipit imperdiet, magna metus scelerisque lacus, id feugiat tortor tellus eu orci. \
    \
    Morbi ultricies nibh nisi, vel rutrum elit consequat vel. Sed pretium purus eu ipsum hendrerit dapibus. Ut nulla leo, tincidunt et aliquam venenatis, porttitor vitae tortor. Donec eget tortor lobortis, auctor mi pharetra, rhoncus massa. Phasellus eget augue non lectus suscipit gravida a eu orci. Phasellus mollis purus ligula, non tempor ligula imperdiet eu. Nulla imperdiet pharetra orci, non commodo lorem luctus eu. Suspendisse at laoreet tortor. In fringilla cursus dictum. Integer molestie vestibulum fringilla. Sed id tincidunt magna. \
    \
    Duis vehicula tortor at ex pretium, in lacinia libero porta. Pellentesque risus dolor, viverra id molestie ut, ornare nec nulla. Phasellus tincidunt nisl eget lorem bibendum malesuada. Maecenas commodo imperdiet malesuada. Phasellus porttitor convallis nisi non porttitor. Nullam eleifend sem in quam placerat, quis semper augue dictum. Donec ultrices quam non lorem varius tristique eget a erat. Pellentesque vel imperdiet nisi. Sed turpis justo, mattis a ex in, pharetra dictum mauris. Duis eget tincidunt est. Praesent ut commodo magna. Maecenas imperdiet consequat mattis. Donec dignissim orci ac venenatis eleifend.'

export default Home;