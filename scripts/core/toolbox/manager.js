import { TOOLS_MENU } from "../../shared/constants.js";
import { canvas } from "../canvas/canvas.js";

const sideBarMenuElem = document.getElementById("tools");
const toolsMenuElem = document.getElementById('toolsmenu');

class ToolBoxManager {
    constructor() {
        ('Tool Manager')
        this.activeToolId = 'L-line';
        this.#addEventListener();
    }

    #addEventListener() {
        sideBarMenuElem.addEventListener("click", (e) => {
            toolsMenuElem.style.visibility = 'hidden';
            const tool = e.target;
            if (!TOOLS_MENU[tool.id[0]]?.includes(tool.id)) return;
            const prevM = toolsMenuElem.querySelector(`#${this.activeToolId[0]}`);
            const newM = toolsMenuElem.querySelector(`#${tool.id[0]}`);
            prevM.style.display = 'none';
            newM.style.display = 'flex';
            if (e.ctrlKey && TOOLS_MENU[tool.id[0]].length > 1) {
                const { top, right } = tool.getBoundingClientRect();
                toolsMenuElem.style.top = top + 'px';
                toolsMenuElem.style.left = (right + 10) + 'px';
                toolsMenuElem.style.visibility = 'visible';
            }
            this.selectTool(tool.id);
        });

        toolsMenuElem.addEventListener('click', (e) => {
            toolsMenuElem.style.visibility = 'hidden';
            if (!TOOLS_MENU[e.target.id[0]]?.includes(e.target.id)) return;
            this.selectTool(e.target.id);
        })
    }

    selectTool(id) {
        canvas.releasePath();
        let elem;
        const toolsMenu = TOOLS_MENU[id[0]];

        for (let i = 0; i < toolsMenu.length; i++) {
            if (toolsMenu[i] == id) {
                elem = document.getElementById(id);
                break;
            };
        }

        sideBarMenuElem.querySelector(`#${this.activeToolId}`).classList.remove('selected');
        let selectedElem = sideBarMenuElem.querySelector(`#${elem.id}`);
        if (!selectedElem) {
            selectedElem = sideBarMenuElem.querySelector(`[id^=${elem.id[0]}]`);
            const tempSrc = elem.src;
            const tempId = elem.id;
            elem.src = selectedElem.src;
            elem.id = selectedElem.id;
            selectedElem.src = tempSrc;
            selectedElem.id = tempId;
            selectedElem.classList.add('selected');
        } else {
            selectedElem = elem;
        }
        selectedElem.classList.add('selected');

        this.activeToolId = selectedElem.id;
    }
}

const toolsManager = new ToolBoxManager();
export default toolsManager;