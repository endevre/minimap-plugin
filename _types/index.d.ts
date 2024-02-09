import { BaseSchemes, GetSchemes, NodeEditor, Root, Scope } from 'rete';
import { Area2D, AreaPlugin, RenderSignal } from 'rete-area-plugin';
import { Rect } from './types';
declare type NodeSize = {
    width: number;
    height: number;
};
declare type ExpectedScheme = GetSchemes<BaseSchemes['Node'] & NodeSize, BaseSchemes['Connection']>;
export declare type Transform = {
    x: number;
    y: number;
    k: number;
};
/**
 * Extra signal types for minimap rendering
 * @priority 10
 */
export declare type MinimapExtra = RenderSignal<'minimap', {
    ratio: number;
    nodes: Rect[];
    viewport: Rect;
    start(): Transform;
    translate(dx: number, dy: number): void;
    point(x: number, y: number): void;
}>;
/**
 * Minimap plugin, triggers rendering of the minimap
 * @priority 9
 * @listens nodetranslated
 * @listens nodecreated
 * @listens noderemoved
 * @listens translated
 * @listens resized
 * @listens noderesized
 * @listens zoomed
 * @emits render
 */
export declare class MinimapPlugin<Schemes extends ExpectedScheme> extends Scope<never, [Area2D<Schemes> | MinimapExtra, Root<Schemes>]> {
    private props?;
    element: HTMLElement;
    editor: NodeEditor<Schemes>;
    area: AreaPlugin<Schemes, MinimapExtra>;
    ratio: number;
    minDistance: number;
    boundViewport: boolean;
    /**
     * @constructor
     * @param props Plugin properties
     * @param props.ratio minimap ratio. Default is `1`
     * @param props.minDistance minimap minimum distance. Default is `2000`
     * @param props.boundViewport whether to bound the mini-viewport to the minimap. Default is `false`
     */
    constructor(props?: {
        minDistance?: number | undefined;
        ratio?: number | undefined;
        boundViewport?: boolean | undefined;
    } | undefined);
    setParent(scope: Scope<MinimapExtra | Area2D<Schemes>, [Root<Schemes>]>): void;
    private getNodesRect;
    getCurrNodes(): {
        left: number;
        top: number;
        width: number;
        height: number;
        id: string | undefined;
    }[];
    private render;
}
export {};
//# sourceMappingURL=index.d.ts.map