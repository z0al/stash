// Different font styles
const font = {
	inherit: 'font-weight:inherit',
	normal: 'font-weight:normal',
	bold: 'font-weight:bold'
};

// Logger styles
export const styles = {
	inherit: `color:inherit;${font.inherit}`,
	action: `color:gray;${font.normal}`,
	thunk: `color:orange;${font.normal}`,
	time: `color: darkgray;${font.normal}`,
	prevstate: `color:#9E9E9E;${font.bold}`,
	payload: `color:#03A9F4;${font.bold}`,
	newstate: `color:#4CAF50;${font.bold}`
};
