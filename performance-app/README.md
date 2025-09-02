## Performance Analysis: Before vs. After Optimization

The application was profiled for key user interactions both before and after implementing performance optimizations (`React.memo`, `useMemo`, `useCallback`). Each action was profiled in a separate session for clarity.

### Scenario

1.  Typing "a" into the search bar
2.  Changing the sort order to "Name (A-Z)"
3.  Changing the selected year to "2020"
4.  Click on the "Afghanistan" country card
5.  Adding the "Methane" column in the details table

### Profiler Info

| Interaction | Before Optimization | After Optimization |
| :--- | :---: | :---: 
| **Search Input** <br/> (Typing one "a" character) | **Flamegraph:** <br/>  ![Search Before Flamegraph](https://github.com/user-attachments/assets/781623d5-a47c-4180-a1e5-c5c79bad84d1)<br/><br/> **Ranked Chart:** <br/> ![Search Before Ranked](https://github.com/user-attachments/assets/3243fce8-9656-4af3-8ceb-d3a9c83759c5) <br/> `Render duration: 506 ms` | **Flamegraph:** <br/> ![Search After Flamegraph](https://github.com/user-attachments/assets/4ad31e88-dddb-4db2-ba36-403acc2fd377) <br/><br/> **Ranked Chart:** <br/> ![Search After Ranked](https://github.com/user-attachments/assets/a98dd524-2b86-4c60-bda6-0402124e4478) <br/> `Render duration: 126.3ms` |
| **Sort Change** <br/> (Changing sort order to "Name A-Z") | **Flamegraph:** <br/> ![Sort Before Flamegraph](https://github.com/user-attachments/assets/890ede76-bfcd-45bb-82ce-42ab57bb4d4a) <br/><br/> **Ranked Chart:** <br/> ![Sort Before Ranked](https://github.com/user-attachments/assets/0ee0defc-731b-4daf-8361-ac4bc719a276) <br/> `Render duration: 232.8ms` | **Flamegraph:** <br/> ![Sort After Flamegraph](https://github.com/user-attachments/assets/ff5aed3a-8f7a-43db-9a39-08b74f678731) <br/><br/> **Ranked Chart:** <br/> ![Sort After Ranked](https://github.com/user-attachments/assets/6b47e027-a01f-4ac5-a2a5-5ddcfaca4364) <br/> `Render duration: 157.7ms` |
| **Year Change** <br/> (Selecting a year 2020) | **Flamegraph:** <br/> ![Year Before Flamegraph](https://github.com/user-attachments/assets/f5c0435d-c9a4-44d6-a901-44a886d5f04a) <br/><br/> **Ranked Chart:** <br/> ![Year Before Ranked](https://github.com/user-attachments/assets/849885a3-8c79-4c0b-a461-ee5c5a8c93fc) <br/> `Render duration: 235.3ms` | **Flamegraph:** <br/> ![Year After Flamegraph](https://github.com/user-attachments/assets/9a660a3a-a5c3-4f3b-8c14-78df464af460) <br/><br/> **Ranked Chart:** <br/> ![Year After Ranked](https://github.com/user-attachments/assets/c645613c-2d56-45da-9815-935dc9790f5d) <br/> `Render duration: 294ms` |
| **Open Details** <br/> (Click on "Afghanistan" card) | **Flamegraph:** <br/> ![Details Before Flamegraph](https://github.com/user-attachments/assets/4b77fd4d-3a80-43d1-a9d0-83078fb08bbe) <br/><br/> **Ranked Chart:** <br/> ![Details Before Ranked](https://github.com/user-attachments/assets/cb5d0eb4-42b0-430a-aee7-2027096a98be) <br/> `Render duration: 499ms` | **Flamegraph:** <br/> ![Details After Flamegraph](https://github.com/user-attachments/assets/0ece2d61-4968-4e5d-a761-19887dd1cf1a) <br/><br/> **Ranked Chart:** <br/> ![Details After Ranked](https://github.com/user-attachments/assets/f8a8fb39-150b-4440-852a-68d54f710446) <br/> `Render duration: 316ms` |
| **Column Change** <br/> (Adding a "Methane" column to the table) | **Flamegraph:** <br/> ![Columns Before Flamegraph](https://github.com/user-attachments/assets/221553e8-ef27-4dcb-ae98-5d39445af1d8) <br/><br/> **Ranked Chart:** <br/> ![Columns Before Ranked](https://github.com/user-attachments/assets/a402e7fa-152f-42cb-8f00-0c8094645a61) <br/> `Render duration: 679ms` | **Flamegraph:** <br/> ![Columns After Flamegraph](https://github.com/user-attachments/assets/86d35097-f7ea-4470-bd61-3b05174dd45d) <br/><br/> **Ranked Chart:** <br/> ![Columns After Ranked](https://github.com/user-attachments/assets/90efa672-75db-4904-9fa7-7ccbd7ffabc6) <br/> `Render duration: 422ms` |

### Conclusion 

The applied optimizations successfully addressed the performance bottlenecks identified in the initial profiling. By preventing unnecessary re-renders of large lists and expensive components, the application became more responsive, especially during complex state updates like changing table columns. The use of `React.memo` and `useMemo` proved to be effective.
