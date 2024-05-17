// import React, { useState, useEffect } from 'react';
// import Web3 from 'web3';
// import contractABI from '/Users/bharaths_mac/adminportal/adminpage/src/backend/src/contract_abis/FacultyRegistry.json';
// import './App.css';

// function AdminPortal() {
//     const [formData, setFormData] = useState({
//         name: '',
//         walletId: '',
//         password: '',
//         numSubjects: '',
//         selectedBaskets: [],
//         subjects: []
//     });
//     const [showForm, setShowForm] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');
//     const [web3, setWeb3] = useState(null);
//     const [contract, setContract] = useState(null);
//     const [accounts, setAccounts] = useState([]);

//     const basket1Subjects = [
//         "Differential Equations and Linear Algebra",
//         "Laplace & Fourier Transforms",
//         "Complex Analysis & Numerical Methods",
//         "Discrete Mathematics",
//         "Probability & Statistics",
//         "Calculus",
//         "Mechanics for Engineers",
//         "Optics and Optical Fibres",
//         "Applied Analytical Chemistry",
//         "Applied Engineering Materials",
//         "Environmental Studies"
//     ];

//     const basket2Subjects = [
//         "Optimisation Techniques",
//         "Engineering Economics and Costing",
//         "Project Management",
//         "Gender, Human Rights and Ethics",
//         "Climate Change, Sustainability and Organisation",
//     ];

//     useEffect(() => {
//         async function loadWeb3() {
//             const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
//             setWeb3(web3);
//         }

//         async function loadContract() {
//             const networkId = await web3.eth.net.getId();
//             const deployedNetwork = contractABI.networks[networkId];
//             if (deployedNetwork) {
//                 const contract = new web3.eth.Contract(
//                     contractABI.abi,
//                     deployedNetwork.address
//                 );
//                 setContract(contract);
//             } else {
//                 console.error('Contract not deployed to detected network.');
//             }
//         }

//         async function loadAccounts() {
//             const accounts = await web3.eth.getAccounts();
//             setAccounts(accounts);
//         }

//         if (web3) {
//             loadContract();
//             loadAccounts();
//         } else {
//             loadWeb3();
//         }
//     }, [web3]);

//     const handleChange = (e, index) => {
//         const { name, value } = e.target;
//         const updatedSubjects = [...formData.subjects];
//         updatedSubjects[index] = {
//             ...updatedSubjects[index],
//             [name]: value
//         };
//         setFormData(prevState => ({
//             ...prevState,
//             subjects: updatedSubjects
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const emptyFields = [];
//         if (formData.name.trim() === '') emptyFields.push('Name');
//         if (!web3.utils.isAddress(formData.walletId)) emptyFields.push('Valid Wallet ID');
//         if (formData.password.trim() === '') emptyFields.push('Password');
//         if (formData.numSubjects.trim() === '') emptyFields.push('Number of Subjects');

//         if (formData.subjects) {
//             formData.subjects.forEach((subject, index) => {
//                 if (subject.name.trim() === '') emptyFields.push(`Subject ${index + 1} Name`);
//                 if (subject.semester.trim() === '') emptyFields.push(`Subject ${index + 1} Semester`);
//             });
//         }

//         if (emptyFields.length > 0) {
//             setErrorMessage(`Please fill out the following fields: ${emptyFields.join(', ')}`);
//             return;
//         }

//         const passwordHash = web3.utils.keccak256(formData.password);

//         try {
//             await contract.methods.registerFaculty(
//                 formData.name,
//                 formData.walletId,
//                 passwordHash,
//                 parseInt(formData.numSubjects),
//                 formData.selectedBaskets,
//                 formData.subjects.map(subject => subject.name),
//                 formData.subjects.map(subject => parseInt(subject.semester))
//             ).send({ from: accounts[0], gas: 3000000 });

//             setSuccessMessage('Form submitted successfully!');
//         } catch (error) {
//             setErrorMessage('Error submitting form: ' + error.message);
//         }

//         setShowForm(false);
//     };

//     const handleNumSubjectsChange = (e) => {
//         const { value } = e.target;
//         const numSubjects = parseInt(value);
//         if (!isNaN(numSubjects) && numSubjects >= 0) {
//             setFormData(prevState => ({
//                 ...prevState,
//                 numSubjects: value,
//                 selectedBaskets: Array.from({ length: numSubjects }, () => 'Select Basket'),
//                 subjects: Array.from({ length: numSubjects }, () => ({ name: '', semester: '' }))
//             }));
//         }
//     };

//     const handleBasketChange = (e, index) => {
//         const { value } = e.target;
//         const updatedBaskets = [...formData.selectedBaskets];
//         updatedBaskets[index] = value;
//         setFormData(prevState => ({
//             ...prevState,
//             selectedBaskets: updatedBaskets
//         }));
//     };

//     return (
//         <div>
//             <h1>Admin Portal</h1>
//             {showForm ? (
//                 <form id="adminForm" onSubmit={handleSubmit}>
//                     <label htmlFor="name">Name:</label><br />
//                     <input type="text" id="name" name="name" value={formData.name} onChange={(e) => setFormData(prevState => ({ ...prevState, name: e.target.value }))} /><br />
//                     <label htmlFor="walletId">Wallet ID:</label><br />
//                     <input type="text" id="walletId" name="walletId" value={formData.walletId} onChange={(e) => setFormData(prevState => ({ ...prevState, walletId: e.target.value }))} /><br />
//                     <label htmlFor="password">Password:</label><br />
//                     <input type="password" id="password" name="password" value={formData.password} onChange={(e) => setFormData(prevState => ({ ...prevState, password: e.target.value }))} /><br />
//                     <label htmlFor="numSubjects">Number of Subjects:</label><br />
//                     <input type="number" id="numSubjects" name="numSubjects" value={formData.numSubjects} onChange={handleNumSubjectsChange} /><br /><br />
//                     {formData.numSubjects && (
//                         <div>
//                             {formData.selectedBaskets.map((selectedBasket, index) => (
//                                 <div key={index}>
//                                     <label htmlFor={`selectedBasket${index + 1}`}>Select Basket for Subject {index + 1}:</label><br />
//                                     <select id={`selectedBasket${index + 1}`} name={`selectedBasket${index + 1}`} value={selectedBasket} onChange={(e) => handleBasketChange(e, index)}>
//                                         <option value="">Select Basket</option>
//                                         {[1, 2].map(basketNumber => (
//                                             <option key={basketNumber} value={`Basket ${basketNumber}`}>Basket {basketNumber}</option>
//                                         ))}
//                                     </select><br /><br />
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                     {formData.numSubjects && formData.selectedBaskets.map((selectedBasket, index) => (
//                         <div key={index}>
//                             {selectedBasket === 'Basket 1' && (
//                                 <div>
//                                     <label htmlFor={`subjectName${index + 1}`}>Subject {index + 1} Name:</label><br />
//                                     <select id={`subjectName${index + 1}`} name="name" value={formData.subjects[index]?.name || ''} onChange={(e) => handleChange(e, index)}>
//                                         <option value="">Select Subject</option>
//                                         {basket1Subjects.map(subject => (
//                                             <option key={subject} value={subject}>{subject}</option>
//                                         ))}
//                                     </select><br />
//                                     <label htmlFor={`subjectSemester${index + 1}`}>Subject {index + 1} Semester:</label><br />
//                                     <input type="number" id={`subjectSemester${index + 1}`} name="semester" value={formData.subjects[index]?.semester || ''} min="1" max="8" onChange={(e) => handleChange(e, index)} /><br /><br />
//                                 </div>
//                             )}
//                             {selectedBasket === 'Basket 2' && (
//                                 <div>
//                                     <label htmlFor={`subjectName${index + 1}`}>Subject {index + 1} Name:</label><br />
//                                     <select id={`subjectName${index + 1}`} name="name" value={formData.subjects[index]?.name || ''} onChange={(e) => handleChange(e, index)}>
//                                         <option value="">Select Subject</option>
//                                         {basket2Subjects.map(subject => (
//                                             <option key={subject} value={subject}>{subject}</option>
//                                         ))}
//                                     </select><br />
//                                     <label htmlFor={`subjectSemester${index + 1}`}>Subject {index + 1} Semester:</label><br />
//                                     <input type="number" id={`subjectSemester${index + 1}`} name="semester" value={formData.subjects[index]?.semester || ''} min="1" max="8" onChange={(e) => handleChange(e, index)} /><br /><br />
//                             </div>
//                             )}
//                             </div>
//                             ))}
//                             <button type="submit">Submit</button>
//                             {errorMessage && <p className="error-message">{errorMessage}</p>}
//                             {successMessage && <p className="success-message">{successMessage}</p>}
//                             </form>
//                             ) : (
//                             <button onClick={() => setShowForm(true)}>Add Faculty</button>
//                             )}
//                             </div>
//                             );
//                             }

// export default AdminPortal;
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractABI from '/Users/bharaths_mac/adminportal/adminpage/src/backend/src/contract_abis/FacultyRegistry.json';
import './App.css';

function AdminPortal() {
    const [formData, setFormData] = useState({
        name: '',
        walletId: '',
        password: '',
        numSubjects: '',
        selectedBaskets: [],
        subjects: []
    });
    const [showForm, setShowForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [accounts, setAccounts] = useState([]);

    const basket1Subjects = [
        "Differential Equations and Linear Algebra",
        "Laplace & Fourier Transforms",
        "Complex Analysis & Numerical Methods",
        "Discrete Mathematics",
        "Probability & Statistics",
        "Calculus",
        "Mechanics for Engineers",
        "Optics and Optical Fibres",
        "Applied Analytical Chemistry",
        "Applied Engineering Materials",
        "Environmental Studies"
    ];

    const basket2Subjects = [
        "Optimisation Techniques",
        "Engineering Economics and Costing",
        "Project Management",
        "Gender, Human Rights and Ethics",
        "Climate Change, Sustainability and Organisation",
    ];

    useEffect(() => {
        async function loadWeb3() {
            const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
            setWeb3(web3);
        }

        async function loadContract() {
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = contractABI.networks[networkId];
            if (deployedNetwork) {
                const contract = new web3.eth.Contract(
                    contractABI.abi,
                    deployedNetwork.address
                );
                setContract(contract);
            } else {
                console.error('Contract not deployed to detected network.');
            }
        }

        async function loadAccounts() {
            const accounts = await web3.eth.getAccounts();
            setAccounts(accounts);
        }

        if (web3) {
            loadContract();
            loadAccounts();
        } else {
            loadWeb3();
        }
    }, [web3]);

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedSubjects = [...formData.subjects];
        updatedSubjects[index] = {
            ...updatedSubjects[index],
            [name]: value
        };
        setFormData(prevState => ({
            ...prevState,
            subjects: updatedSubjects
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emptyFields = [];
        if (formData.name.trim() === '') emptyFields.push('Name');
        if (!web3.utils.isAddress(formData.walletId)) emptyFields.push('Valid Wallet ID');
        if (formData.password.trim() === '') emptyFields.push('Password');
        if (formData.numSubjects.trim() === '') emptyFields.push('Number of Subjects');

        if (formData.subjects) {
            formData.subjects.forEach((subject, index) => {
                if (subject.name.trim() === '') emptyFields.push(`Subject ${index + 1} Name`);
                if (subject.semester.trim() === '') emptyFields.push(`Subject ${index + 1} Semester`);
            });
        }

        if (emptyFields.length > 0) {
            setErrorMessage(`Please fill out the following fields: ${emptyFields.join(', ')}`);
            return;
        }

        const passwordHash = web3.utils.keccak256(formData.password);

        try {
            // Prepare arrays for Solidity function parameters
            const selectedBaskets = formData.selectedBaskets.map(basket => `Basket ${basket.charAt(basket.length - 1)}`); // Assuming selectedBaskets are already strings like "Basket 1", "Basket 2"
            const subjectNames = formData.subjects.map(subject => subject.name);
            const subjectSemesters = formData.subjects.map(subject => parseInt(subject.semester));

            // Call registerFaculty method on the contract
            await contract.methods.registerFaculty(
                formData.name,
                formData.walletId,
                passwordHash,
                parseInt(formData.numSubjects),
                selectedBaskets,
                subjectNames,
                subjectSemesters
            ).send({ from: accounts[0], gas: 3000000 });

            setSuccessMessage('Form submitted successfully!');
        } catch (error) {
            setErrorMessage('Error submitting form: ' + error.message);
        }

        setShowForm(false);
    };

    const handleNumSubjectsChange = (e) => {
        const { value } = e.target;
        const numSubjects = parseInt(value);
        if (!isNaN(numSubjects) && numSubjects >= 0) {
            setFormData(prevState => ({
                ...prevState,
                numSubjects: value,
                selectedBaskets: Array.from({ length: numSubjects }, (_, i) => `Basket ${i + 1}`), // Initialize baskets as per numSubjects
                subjects: Array.from({ length: numSubjects }, () => ({ name: '', semester: '' }))
            }));
        }
    };

    const handleBasketChange = (e, index) => {
        const { value } = e.target;
        const updatedBaskets = [...formData.selectedBaskets];
        updatedBaskets[index] = value;
        setFormData(prevState => ({
            ...prevState,
            selectedBaskets: updatedBaskets
        }));
    };

    return (
        <div>
            <h1>Admin Portal</h1>
            {showForm ? (
                <form id="adminForm" onSubmit={handleSubmit}>
                    <label htmlFor="name">Name:</label><br />
                    <input type="text" id="name" name="name" value={formData.name} onChange={(e) => setFormData(prevState => ({ ...prevState, name: e.target.value }))} /><br />
                    <label htmlFor="walletId">Wallet ID:</label><br />
                    <input type="text" id="walletId" name="walletId" value={formData.walletId} onChange={(e) => setFormData(prevState => ({ ...prevState, walletId: e.target.value }))} /><br />
                    <label htmlFor="password">Password:</label><br />
                    <input type="password" id="password" name="password" value={formData.password} onChange={(e) => setFormData(prevState => ({ ...prevState, password: e.target.value }))} /><br />
                    <label htmlFor="numSubjects">Number of Subjects:</label><br />
                    <input type="number" id="numSubjects" name="numSubjects" value={formData.numSubjects} onChange={handleNumSubjectsChange} /><br /><br />
                    {formData.numSubjects && (
                        <div>
                            {formData.selectedBaskets.map((selectedBasket, index) => (
                                <div key={index}>
                                    <label htmlFor={`selectedBasket${index + 1}`}>Select Basket for Subject {index + 1}:</label><br />
                                    <select id={`selectedBasket${index + 1}`} name={`selectedBasket${index + 1}`} value={selectedBasket} onChange={(e) => handleBasketChange(e, index)}>
                                        <option value="">Select Basket</option>
                                        {[1, 2].map(basketNumber => (
                                            <option key={basketNumber} value={`Basket ${basketNumber}`}>Basket {basketNumber}</option>
                                        ))}
                                    </select><br /><br />
                                </div>
                            ))}
                        </div>
                    )}
                    {formData.numSubjects && formData.selectedBaskets.map((selectedBasket, index) => (
                        <div key={index}>
                            {selectedBasket === `Basket ${index + 1}` && ( // Ensure selectedBasket matches the format "Basket 1", "Basket 2", etc.
                                <div>
                                    <label htmlFor={`subjectName${index + 1}`}>Subject {index + 1} Name:</label><br />
                                    <select id={`subjectName${index + 1}`} name="name" value={formData.subjects[index]?.name || ''} onChange={(e) => handleChange(e, index)}>
                                        <option value="">Select Subject</option>
                                        {index === 0 ? basket1Subjects.map(subject => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        )) : basket2Subjects.map(subject => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        ))}
                                    </select><br />
                                    <label htmlFor={`subjectSemester${index + 1}`}>Subject {index + 1} Semester:</label><br />
                                    <input type="number" id={`subjectSemester${index + 1}`} name="semester" value={formData.subjects[index]?.semester || ''} min="1" max="8" onChange={(e) => handleChange(e, index)} /><br /><br />
</div>
)}
</div>
))}
<button type="submit">Submit</button>
{errorMessage && <p className="error-message">{errorMessage}</p>}
{successMessage && <p className="success-message">{successMessage}</p>}
</form>
) : (
<button onClick={() => setShowForm(true)}>Add Faculty</button>
)}
</div>
);
}

export default AdminPortal;
