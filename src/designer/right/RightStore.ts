import {action, makeObservable, observable, runInAction} from "mobx";
import {MenuInfo} from "./MenuType";
import {AbstractDefinition} from "../../framework/core/AbstractDefinition";
import DesignerLoaderFactory from "../loader/DesignerLoaderFactory";

/**
 * 激活元素
 */
export interface ActiveElem {
    //元素id
    id?: string;
    //元素类型
    type?: string;
}


/**
 * 设计器。右侧组件配置状态管理类
 */
class RightStore {
    constructor() {
        makeObservable(this, {
            menus: observable,
            activeMenu: observable,
            visible: observable,
            setActiveMenu: action,
            setContentVisible: action,
            activeConfig: action,
        })
    }

    /**
     * 当前选中的组件
     */
    activeElem: ActiveElem = {};
    /**
     * 当前选中组件的操作菜单列表
     */
    menus: Array<MenuInfo> = [];
    /**
     * 当前选中组件的操作菜单列表中处于激活状态的菜单
     */
    activeMenu: string = '';
    /**
     * 右侧组件配置区域是否可见
     */
    visible: boolean = false;

    setActiveMenu = (menu: string) => this.activeMenu = menu;

    setContentVisible = (visible: boolean) => this.visible = visible;

    activeConfig = (id: string | null, type: string | null) => {
        if (!id || !type) {
            this.activeMenu = '';
            this.activeElem = {};
            this.menus = [];
            if (this.visible)
                this.visible = false;
            return;
        }
        //更新菜单列表
        this.menus = (DesignerLoaderFactory.getLoader()?.definitionMap[type] as AbstractDefinition)?.getMenuList() || [];
        if (this.menus.length > 0) {
            let setNewActiveMenu = true;
            for (let i = 0; i < this.menus.length; i++) {
                if (this.menus[i].key === this.activeMenu) {
                    setNewActiveMenu = false;
                    break;
                }
            }
            if (setNewActiveMenu && this.visible)
                this.activeMenu = this.menus[0].key;
        }
        this.activeElem = {id, type};
        //重新挂载配置面板
        if (this.visible) {
            this.visible = false;
            const tempTimer = setTimeout(() => {
                runInAction(() => this.visible = true);
                clearTimeout(tempTimer);
            }, 0);
        }
    }
}

const rightStore = new RightStore();
export default rightStore;