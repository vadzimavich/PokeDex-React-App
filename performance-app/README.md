# React Performance Analysis

This section documents the performance profiling of the application before and after optimizations

### Scenario

1.  Typing "United" into the search bar
2.  Changing the sort order to "Name (A-Z)"
3.  Changing the selected year to "2020"
4.  Opening the detailed view for a country
5.  Changing the visible columns in the details table

### Profiler Screenshots

> **Flamegraph Before Optimization**
> <img width="1243" height="256" alt="Image" src="https://github.com/user-attachments/assets/1b0f81db-412c-4683-962b-95be2a1e544e" /> 
> <img width="1251" height="194" alt="Image" src="https://github.com/user-attachments/assets/910f850d-2843-4656-a1e8-6b02a619ef63" />

> **Flamegraph After Optimization**
> <img width="1725" height="276" alt="Image" src="https://github.com/user-attachments/assets/c9a2fddd-beea-4453-ae97-bc49059f72b8" />
> <img width="1720" height="197" alt="Image" src="https://github.com/user-attachments/assets/8a86f6ad-9adf-4ea9-a885-d64822d5fd02" />

> **Ranked Chart Before Optimization**
> <img width="1234" height="301" alt="Image" src="https://github.com/user-attachments/assets/d8f39829-a809-4835-ab81-75893fba135b" />
> <img width="1242" height="365" alt="Image" src="https://github.com/user-attachments/assets/d8a7be21-c584-4015-aa33-f783ca65571d" />

> **Ranked Chart After Optimization**
> <img width="1718" height="268" alt="Image" src="https://github.com/user-attachments/assets/21428e5c-a925-4fa1-b5d1-c37d318885df" />
> <img width="1722" height="276" alt="Image" src="https://github.com/user-attachments/assets/d06ecbf8-8558-4d8b-9ec6-b9e270dfc0be" />