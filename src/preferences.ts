interface Preferences<Value> {
    [Key: string]: Value
}

const preferences: Preferences<string|number|boolean> = {
    escapeChar: "\\"
};

export default preferences;
