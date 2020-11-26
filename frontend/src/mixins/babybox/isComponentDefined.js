export default {
    methods: {
        isComponentDefined: function() {
            return (
                this.babybox.components &&
                this.babybox.components != {} &&
                (
                    this.babybox.components.camera != "" || 
                    this.babybox.components.OS != "" || 
                    this.babybox.components.PC != ""
                )
            )
        }
    }
}