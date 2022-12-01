import { ReteOptions } from 'rete-cli'

export default <ReteOptions>{
    input: 'src/index.ts',
    name: 'MinimapPlugin',
    globals: {
        'rete': 'Rete',
        'rete-area-plugin': 'ReteAreaPlugin'
    },
}
