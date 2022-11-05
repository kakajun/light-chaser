import React, {Component} from 'react';
import ReactGridLayout from 'react-grid-layout';
import getChartsTemplate from "../charts/ComponentChartInit";

class Preview extends Component<any, any> {

    state: any = {};

    constructor(props: any) {
        super(props);
        const {location} = this.props;
        let screens = JSON.parse(window.localStorage.lightChaser);
        let screen;
        for (let i = 0; i < screens.length; i++) {
            if (screens[i].id === location.state.id) {
                screen = screens[i];
                break;
            }
        }
        screen.layoutConfigs = JSON.parse(screen.layoutConfigs);
        screen.chartConfigs = JSON.parse(screen.chartConfigs);
        this.state = {LCDesignerStore: screen};
    }

    generateElement = () => {
        const {LCDesignerStore} = this.state;
        const {layoutConfigs = [], chartConfigs} = LCDesignerStore!;
        return layoutConfigs.map((item: any) => {
            let ElementChart = getChartsTemplate(item.name);
            return (
                <div key={item?.id + ''} style={{width: '100%', height: '100%'}}>
                    <ElementChart elemId={item?.id} LCDesignerStore={LCDesignerStore}/>
                </div>
            );
        })
    }

    render() {
        const {LCDesignerStore} = this.state;
        const {layoutConfigs = []} = LCDesignerStore;
        for (let i = 0; i < layoutConfigs.length; i++) {
            layoutConfigs[i].static = true;
            layoutConfigs[i].isDraggable = false;
        }
        return (
            <div className="site-layout-background" style={{height: 1080, width: 1920, backgroundColor: '#131e26',}}>
                <ReactGridLayout className="layout"
                                 layout={layoutConfigs}
                                 cols={48}
                                 rowHeight={10}
                                 margin={[15, 15]}
                                 useCSSTransforms={true}
                                 preventCollision={false}
                                 allowOverlap={true}
                                 isResizable={false}
                                 isBounded={true}
                                 isDroppable={false}
                                 style={{height: 1080, width: 1920, backgroundColor: '#131e26',}}
                                 width={1920}>
                    {this.generateElement()}
                </ReactGridLayout>
            </div>
        );
    }
}

export default Preview;