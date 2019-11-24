interface State {}

interface Dictionary<T> {
    [Key: string]: T;
}

export default abstract class Component {
    abstract state: State;

    protected constructor(useState: boolean) {

    }
}
