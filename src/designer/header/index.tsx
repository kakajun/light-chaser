import React, {Component, ReactElement} from 'react';
import '../style/Head.less';
import {RouteComponentProps, withRouter} from "react-router-dom";
import {createProject, updateProject} from "../../local/LocalStorageUtil";
import lcDesignerContentStore from '../store/LcDesignerContentStore';
import LCDesigner from "../index";
import {headerItems} from "./items/scanner";

interface LcDesignerHeaderProps extends RouteComponentProps {
    LCDesignerStore: LCDesigner;
    updateDesignerStore?: (data: any) => void;
}

class Index extends Component<LcDesignerHeaderProps | any> {

    updateRouteState = (id: number) => {
        const {location} = this.props;
        const {action} = location.state;
        if (action === 'create') {
            this.props.history.replace("/designer", {
                ...location.state, ...{
                    action: 'edit',
                    id,
                }
            });
        }
    }

    doSave = () => {
        let {id = -1, projectConfig: {saveType}, setId} = lcDesignerContentStore;
        if (saveType === 'local') {
            if (id === -1) {
                createProject(lcDesignerContentStore).then((id: number | any) => {
                    if (id > -1) {
                        //更新id
                        setId && setId(id);
                        //修改路由参数，新增变为更新
                        this.updateRouteState(id);
                        alert("create success");
                    }
                });
            } else {
                updateProject(lcDesignerContentStore).then(() => {
                    alert("update success");
                });
            }
        }
    }

    doPreview = () => {
        const {LCDesignerStore} = this.props;
        this.props.history.push('/view', {id: LCDesignerStore.id});
    }

    buildHeaderList = (): Array<ReactElement> => {
        let items: Array<ReactElement> = [];
        let compNames = Object.keys(headerItems);
        if (headerItems && compNames.length > 0) {
            for (let i = 0; i < compNames.length; i++) {
                const {icon: Icon, name, onClick} = new headerItems[compNames[i]]().getHeaderItemInfo();
                items.push(
                    <div key={i + ''} className={'right-item'} onClick={onClick}>
                        <span className={'item-span'}><Icon/>&nbsp;{name}</span>
                    </div>
                );
            }
        }
        return items;
    }


    render() {
        const items = this.buildHeaderList();
        return (
            <div className={'designer-header'}>
                <div className={'header-left'}>
                    <div className={'header-title'}>LC DESIGNER</div>
                </div>
                <div className={'header-right'}>
                    {items}
                </div>
            </div>
        );
    }
}

export default withRouter(Index);
