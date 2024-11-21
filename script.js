    // Object to store each quest’s initial position
    let initialPositions = {};

    // Store initial positions and restore completion state on page load
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll('.quest').forEach((quest, index) => {
            initialPositions[quest.id] = {
                parent: quest.parentNode,
                position: index
            };

            // Check if this quest was marked as complete in sessionStorage
            if (sessionStorage.getItem(quest.id) === "complete") {
                moveToCompletedSection(quest);
            }
        });
    });

    function markComplete(button) {
        const quest = button.parentNode.parentNode;
        const npcName = quest.querySelector("[data-npc]")?.getAttribute("data-npc");
    
        moveToCompletedSection(quest);
    
        // Save completion status in sessionStorage
        sessionStorage.setItem(quest.id, "complete");
    
        if (npcName) {
            // Check if any other quests still reference this NPC
            const remainingQuests = Array.from(document.querySelectorAll(".quest"))
                .filter(q => sessionStorage.getItem(q.id) !== "complete");
            
            const stillUsed = remainingQuests.some(q => {
                const npc = q.querySelector("[data-npc]");
                return npc && npc.getAttribute("data-npc") === npcName;
            });
    
            // If no other quests reference the NPC, remove it from the NPC summary
            if (!stillUsed) {
                const npcList = document.getElementById("npc-list");
                Array.from(npcList.children).forEach(item => {
                    if (item.textContent === npcName) {
                        npcList.removeChild(item);
                    }
                });
            }
        }
    }
    

    function moveToCompletedSection(quest) {
        const completedContainer = document.getElementById('completed-container');
        if (!completedContainer) {
            console.error("Completed container not found.");
            return;
        }
    
        // Hide quest details except for the name and quest chain
        const questDetails = quest.querySelectorAll("p, .reward, .note");
        questDetails.forEach(detail => detail.style.display = "none");
    
        // Ensure the quest chain is visible and displayed below the quest name
        const chainContainer = quest.querySelector(".quest-chain-container");
        if (chainContainer) {
            chainContainer.style.display = "block"; // Ensure it's visible
            chainContainer.style.position = "static"; // Remove absolute positioning
            chainContainer.style.width = "100%"; // Adjust to fit the parent
            chainContainer.style.marginTop = "10px"; // Add some spacing
            chainContainer.style.boxShadow = "none"; // Remove any shadow
        }
    
        // Move the quest to the completed container
        completedContainer.appendChild(quest);
    
        // Update the button for resetting
        const button = quest.querySelector('button');
        button.textContent = "Reset";
        button.classList.add("reset-button");
        button.onclick = function () { resetQuest(quest); };
    
        console.log(`Quest ${quest.id} moved to completed section.`);
    }
    
    
    
    

    function resetQuest(quest) {
        if (!initialPositions[quest.id]) {
            console.error(`Initial position for ${quest.id} is not initialized.`);
            return;
        }
    
        const { parent, position } = initialPositions[quest.id];
    
        // Move the quest back to its initial position
        if (parent.children[position]) {
            parent.insertBefore(quest, parent.children[position]);
        } else {
            parent.appendChild(quest); // Append if no specific position found
        }
    
        // Update button functionality and style
        const button = quest.querySelector('button');
        button.textContent = "Complete";
        button.classList.remove("reset-button");
        button.classList.add("complete-button");
        button.onclick = function () { markComplete(button); };
    
        // Reset the visibility of all quest details
        const questDetails = quest.querySelectorAll("p, .reward, .note, .quest-sidebar");
        questDetails.forEach(detail => detail.style.display = "");
    
        // Reset the quest chain container's design
        const chainContainer = quest.querySelector(".quest-chain-container");
        if (chainContainer) {
            chainContainer.style.display = ""; // Restore default display
            chainContainer.style.position = ""; // Restore default position
            chainContainer.style.width = ""; // Reset width
            chainContainer.style.marginTop = ""; // Reset margin
            chainContainer.style.boxShadow = ""; // Reset shadow
            chainContainer.style.border = ""; // Restore border
            chainContainer.style.borderRadius = ""; // Restore border radius
        }
    
        // Re-add the NPC to the summary if it was removed
        const npcName = quest.querySelector("[data-npc]")?.getAttribute("data-npc");
        if (npcName) {
            const npcList = document.getElementById("npc-list");
            const npcExists = Array.from(npcList.children).some(item => item.textContent === npcName);
    
            // Add the NPC back to the list if it doesn't exist
            if (!npcExists) {
                const listItem = document.createElement("li");
                listItem.textContent = npcName;
                npcList.appendChild(listItem);
            }
        }
    
        // Remove completion status from sessionStorage
        sessionStorage.removeItem(quest.id);
    
        console.log(`Quest ${quest.id} reset to its initial position.`);
    }
    
    

    function resetAll() {
        if (Object.keys(initialPositions).length === 0) {
            console.error("Initial positions are not initialized. Reset aborted.");
            return;
        }
    
        Object.keys(initialPositions).forEach(questId => {
            const quest = document.getElementById(questId);
            resetQuest(quest);
        });
    
        console.log("All quests have been reset.");
    }
    

    // Attach the resetAll function to the reset button
    document.getElementById("reset-button").onclick = resetAll;

    document.addEventListener("DOMContentLoaded", function() {
        // Define quest chains with a single chain ID and associated quests
        const questChains140_149 = {
            1: ["quest-2", "quest-3", "quest-4", "quest-5"],
            2: ["quest-7", "quest-8"],
            3: ["quest-10", "quest-11", "quest-12"],
            4: ["quest-13", "quest-14"],
            5: ["quest-17", "quest-18", "quest-19"],
            6: ["quest-20", "quest-21", "quest-22"]
        };
        const questChains150_159 = {
            1: ["quest-1", "quest-2"],
            2: ["quest-3", "quest-4"],
            3: ["quest-5", "quest-6", "quest-7", "quest-8", "quest-9", "quest-10"],
            4: ["quest-11", "quest-12"],
            5: ["quest-14", "quest-15", "quest-16", "quest-17", "quest-18", "quest-19"],
            6: ["quest-22", "quest-23", "quest-24","quest-25", "quest-26"],
            7: ["quest-34", "quest-35", "quest-36","quest-37"]
        };

        // Detect the current page type based on the body data attribute
        const pageType = document.body.getAttribute("data-page");
        let questChains;
    
        if (pageType === "140_149") {
            questChains = questChains140_149;
        } else if (pageType === "150_159") {
            questChains = questChains150_159;
        } else {
            console.error("Unknown page type");
            return; // Exit if the page type is unknown
        }
        
        // Function to display quest chain inside each quest container
        function displayQuestChain(chainId, currentQuestId) {
            const chain = questChains[chainId];
    
            // Verify chain exists
            if (chain) {
                // Locate the container within the current quest to place the quest chain list
                const chainContainer = document.querySelector(`#${currentQuestId} .quest-chain-container`);
                if (!chainContainer) {
                    console.error(`Chain container not found in quest ${currentQuestId}`);
                    return;
                }
    
                // Build the HTML for the quest chain list
                let chainHTML = "<strong>Quest Chain:</strong><ul>";
    
                // Loop through each quest in the chain and add it to the list
                chain.forEach(questId => {
                    const questElement = document.getElementById(questId);
                    const questName = questElement ? questElement.querySelector("h3").textContent : "Unknown Quest";
                    const isActiveClass = questId === currentQuestId ? "active-quest" : "";
                    chainHTML += `<li class="${isActiveClass}">${questName}</li>`;
                });
    
                chainHTML += "</ul>";
                chainContainer.innerHTML = chainHTML;
            } else {
                console.error(`No quest chain found for chain ID ${chainId}`);
            }
        }
    
        // For each quest in each chain, display the chain in its respective container
        Object.keys(questChains).forEach(chainId => {
            questChains[chainId].forEach(questId => {
                displayQuestChain(chainId, questId);
            });
        });
    });
    

const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

function toggleThemeMenu() {
    let themeMenu = document.querySelector('.bd-mode-toggle');

    if (!themeMenu) return;

    // Check local storage for the selected theme and apply it, or auto-detect if no theme is selected
    const selectedTheme = localStorage.getItem('selectedTheme');
    
    // If there's no selected theme in localStorage, check the system preference
    if (!selectedTheme) {
        if (systemPrefersDark) {
            document.body.classList.add('dark-mode');  // Apply dark mode
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode'); // Apply light mode
            document.body.classList.remove('dark-mode');
        }
    } else {
        // Apply the selected theme from localStorage
        if (selectedTheme === 'light') {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        } else {
            document.body.classList.add('dark-mode');  // Apply dark mode
            document.body.classList.remove('light-mode');
        }
    }

    // Update the theme icon (optional)
    const themeIcons = {
        light: 'sun-fill',
        dark: 'moon-stars-fill',
        auto: 'circle-half'
    };

    const themeToggle = document.querySelector('.theme-icon-active use');
    themeToggle.setAttribute('href', `#${themeIcons[selectedTheme || (systemPrefersDark ? 'dark' : 'light')]}`);

    // Remove the active class from all theme buttons
    document.querySelectorAll('[data-bs-theme-value]').forEach(value => {
        value.classList.remove('active');
    });

    // Add the active class to the selected theme button
    const activeThemeButton = document.querySelector(`[data-bs-theme-value="${selectedTheme || (systemPrefersDark ? 'dark' : 'light')}"]`);
    if (activeThemeButton) {
        activeThemeButton.classList.add('active');
    }

    // Event listener for theme button clicks
    document.querySelectorAll('[data-bs-theme-value]').forEach(value => {
        value.addEventListener('click', () => {
            const theme = value.getAttribute('data-bs-theme-value');

            // Apply the theme to the body
            if (theme === 'light') {
                document.body.classList.add('light-mode');
                document.body.classList.remove('dark-mode');
            } else {
                document.body.classList.add('dark-mode');
                document.body.classList.remove('light-mode');
            }

            // Update the theme icon in the dropdown
            const themeToggle = document.querySelector('.theme-icon-active use');
            themeToggle.setAttribute('href', `#${themeIcons[theme]}`);

            // Remove the active class from all theme buttons
            document.querySelectorAll('[data-bs-theme-value]').forEach(button => {
                button.classList.remove('active');
            });

            // Add the active class to the clicked theme button
            value.classList.add('active');

            // Store the selected theme in local storage
            localStorage.setItem('selectedTheme', theme);
        });
    });
}

toggleThemeMenu();



    // JavaScript to collect NPCs and display them
    document.addEventListener("DOMContentLoaded", function () {
        const npcList = new Set();
        const npcElements = document.querySelectorAll("[data-npc]");

        // Collect each unique NPC name from data-npc attributes
        npcElements.forEach(el => npcList.add(el.getAttribute("data-npc")));

        // Display NPCs in the #npc-list element
        const npcListContainer = document.getElementById("npc-list");
        npcList.forEach(npc => {
            const listItem = document.createElement("li");
            listItem.textContent = npc;
            npcListContainer.appendChild(listItem);
        });
    });
