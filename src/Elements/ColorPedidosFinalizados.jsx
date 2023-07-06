const red = {
  background: '#DC3545',
  color: 'white'
}
const blue = {
  background: '#0D6EFD',
  color: 'white'
}
const green = {
  background: '#198754',
  color: 'white'
}

export default function ColorFinalizedOrders ({ item }) {
  if (item.fechaFinalizacion !== "'No Data'") {
    const backgroundColor = item.fechaEnrega > item.fechaFinalizacion ? blue : item.fechaEnrega === item.fechaFinalizacion ? green : red

    return (
        <td style={backgroundColor}>{item.fechaFinalizacion.split('-').reverse().join('/')}</td>
    )
  } else {
    return (
        <td style={{ background: item.color }}>No data</td>
    )
  }
}
