(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[34],{1616:(e,t,s)=>{"use strict";s.d(t,{A:()=>a});var r=s(5155),n=s(7525);s(2115);let a=function(e){let{setStoreSelected:t,storeSelected:s}=e,{storesList:a}=(0,n.E)();return(0,r.jsx)("div",{className:"mt-4",children:(0,r.jsxs)("select",{onChange:e=>t(e.target.value),value:s,className:"w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[(0,r.jsx)("option",{value:"",children:"Select a Store"}),a.map((e,t)=>(0,r.jsx)("option",{value:e,children:e},t))]})})}},2395:(e,t,s)=>{Promise.resolve().then(s.bind(s,6034))},6034:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>p});var r=s(5155),n=s(2115),a=s(2177),o=s(7525),l=s(9670),i=s(5317);let c=async(e,t)=>{try{await (0,i.gS)((0,i.rJ)(l.db,e),t)}catch(e){console.error("Error adding transaction: ",e)}},d=async(e,t)=>{try{await (0,i.BN)((0,i.H9)(l.db,"Lists",e),{[t]:t},{merge:!0})}catch(e){console.error("Error adding transaction: ",e)}};function u(){let[e,t]=(0,n.useState)(""),s=async s=>{s.preventDefault(),e&&(d("Stores",e),t(""))};return(0,r.jsxs)("div",{className:"mt-8",children:[(0,r.jsx)("h3",{className:"text-xl font-semibold text-gray-700",children:"Register New Store"}),(0,r.jsxs)("form",{onSubmit:s,className:"mt-4",children:[(0,r.jsx)("input",{type:"text",value:e,onChange:e=>t(e.target.value),placeholder:"Enter Store Name",className:"w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"}),(0,r.jsx)("button",{type:"submit",className:"w-full mt-4 p-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200",children:"Register Store"})]})]})}function m(e){let{storeSelected:t}=e,{todaysTransactionData:s}=(0,o.E)(),n=t?s.filter(e=>e.store===t):s;return t&&n.length>0&&(0,r.jsx)("div",{className:"mt-8",children:(0,r.jsx)("ul",{className:"mt-4 space-y-4",children:n.map((e,t)=>(0,r.jsx)("li",{className:"p-4 border rounded-md shadow-sm bg-gray-100",children:(0,r.jsxs)("div",{children:[(0,r.jsx)("strong",{children:e.company})," - $",e.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")," (",e.type,")"]})},t))})})}function h(e){let{isModalOpen:t,handleConfirmSubmit:s,setIsModalOpen:n}=e;return t&&(0,r.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50",children:(0,r.jsxs)("div",{className:"bg-white p-6 rounded-lg shadow-lg w-96",children:[(0,r.jsx)("h3",{className:"text-lg font-semibold text-gray-800 mb-4",children:"Confirm Submission"}),(0,r.jsx)("p",{className:"text-gray-600 mb-4",children:"Are you sure you want to submit this transaction?"}),(0,r.jsx)("p",{className:"text-red-600 mb-4 text-lg",children:"You won't be able to edit/change once its confirmed!"}),(0,r.jsxs)("div",{className:"flex justify-between",children:[(0,r.jsx)("button",{onClick:()=>n(!1),className:"px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700",children:"Cancel"}),(0,r.jsx)("button",{onClick:s,className:"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",children:"Confirm"})]})]})})}function g(){let[e,t]=(0,n.useState)(""),s=async s=>{s.preventDefault(),e&&(d("Companies",e),t(""))};return(0,r.jsxs)("div",{className:"mt-8",children:[(0,r.jsx)("h3",{className:"text-xl font-semibold text-gray-700",children:"Register New Company"}),(0,r.jsxs)("form",{onSubmit:s,className:"mt-4",children:[(0,r.jsx)("input",{type:"text",value:e,onChange:e=>t(e.target.value),placeholder:"Enter Company Name",className:"w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"}),(0,r.jsx)("button",{type:"submit",className:"w-full mt-4 p-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200",children:"Register Company"})]})]})}var x=s(1616);let f=function(e){let{companySelected:t,setCompanySelected:s,register:n}=e,{companyList:a}=(0,o.E)();return(0,r.jsxs)("div",{className:"mt-4",children:[(0,r.jsx)("div",{children:"Company:"}),(0,r.jsxs)("select",{...n("company",{required:!0}),onChange:e=>s(e.target.value),value:t,className:"w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[(0,r.jsx)("option",{value:"",children:"Select a Company"}),a.map((e,t)=>(0,r.jsx)("option",{value:e,children:e},t))]})]})};function p(){let[e,t]=(0,n.useState)(""),[s,l]=(0,n.useState)(""),{register:i,handleSubmit:d,reset:p,watch:b}=(0,a.mN)(),[j,v]=(0,n.useState)(!1),[y,w]=(0,n.useState)(null),{addTodaysTransaction:N}=(0,o.E)(),S=t=>{let s={...t,date:new Date().toLocaleDateString()};c(e,{...s}),N({...s,store:e}),l(""),p()},C=e=>{w(e),v(!0)};return(0,r.jsxs)("div",{className:"bg-white shadow-lg rounded-lg p-6",children:[(0,r.jsx)("h2",{className:"text-2xl font-semibold text-gray-700",children:"Add Transaction"}),(0,r.jsx)(x.A,{setStoreSelected:t,storeSelected:e}),e&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(f,{companySelected:s,setCompanySelected:l,register:i}),!s&&(0,r.jsx)(g,{})]}),e&&s&&(0,r.jsxs)("form",{onSubmit:d(e=>C(e)),className:"mt-6 space-y-4",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("div",{children:"Amount:"}),(0,r.jsx)("input",{...i("amount",{required:!0,valueAsNumber:!0}),type:"number",step:".01",placeholder:"Enter Amount",className:"w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("div",{children:"Type:"}),(0,r.jsxs)("select",{...i("type",{required:!0}),className:"w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500",children:[(0,r.jsx)("option",{value:"",children:"Select a Type"}),(0,r.jsx)("option",{value:"Invoice",children:"Invoice"}),(0,r.jsx)("option",{value:"Payment",children:"Payment"})]})]}),(0,r.jsx)("button",{type:"submit",className:"w-full p-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200",children:"Save"})]}),!e&&(0,r.jsx)(u,{}),(0,r.jsx)(h,{isModalOpen:j,handleConfirmSubmit:()=>{S(y),v(!1)},setIsModalOpen:v}),(0,r.jsx)(m,{storeSelected:e})]})}},7525:(e,t,s)=>{"use strict";s.d(t,{M:()=>u,E:()=>d});var r=s(5155),n=s(2115),a=s(9670),o=s(5317);let l=async()=>{try{let e=(0,o.rJ)(a.db,"Lists");return(await (0,o.GG)(e)).docs.map(e=>e.data())}catch(e){return console.error("Error fetching lists: ",e),[]}},i=async e=>{try{let t=e.map(async e=>{let t=(await (0,o.GG)((0,o.rJ)(a.db,e))).docs.map(e=>e.data());return{store:e,transactions:t}});return await Promise.all(t)}catch(e){return console.error("Error fetching lists: ",e),[]}},c=(0,n.createContext)(),d=()=>(0,n.useContext)(c),u=e=>{let{children:t}=e,[s,a]=(0,n.useState)([]),[o,d]=(0,n.useState)([]),[u,m]=(0,n.useState)([]),[h,g]=(0,n.useState)([]);return(0,n.useEffect)(()=>{(async()=>{let[e,t]=await l("Lists"),s=Object.values(t);d(s),a(Object.values(e));let r=await i(s),n=new Date().toLocaleDateString("en-US"),o=h.map(e=>{let{store:t,transactions:s}=e;return s.filter(e=>e.date===n&&""!==e.date).map(e=>({...e,store:t}))}).flat();g(r),m(o)})()},[s,o]),(0,r.jsx)(c.Provider,{value:{companyList:s,storesList:o,todaysTransactionData:u,addTodaysTransaction:e=>{m(t=>[...t,e])},allTransactionsForEachStore:h},children:t})}},9670:(e,t,s)=>{"use strict";s.d(t,{db:()=>i,j:()=>l});var r=s(3915),n=s(6203),a=s(5317);let o=(0,r.Wp)({apiKey:"AIzaSyBrhGNzC2JEoYMR34bXv2vwMBQPVNl3NG8",authDomain:"freshmart-tracker.firebaseapp.com",projectId:"freshmart-tracker",storageBucket:"freshmart-tracker.firebasestorage.app",messagingSenderId:"36913606146",appId:"1:36913606146:web:5516b95ff654f02a9fc11b",measurementId:"G-MP5V2Y0VX2"}),l=(0,n.xI)(o),i=(0,a.aU)(o)}},e=>{var t=t=>e(e.s=t);e.O(0,[992,888,645,558,441,684,358],()=>t(2395)),_N_E=e.O()}]);